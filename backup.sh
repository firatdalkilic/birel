#!/bin/bash

# Bir El App - Otomatik Backup Script
# Bu script günlük backup işlemini gerçekleştirir

set -e

# Environment variables
APP_NAME="birel-web"
DEPLOY_PATH="/var/www/birel"
CURRENT_PATH="$DEPLOY_PATH/current"
BACKUP_PATH="/home/deploy/backups"
BACKUP_LOG="/home/deploy/logs/backup.log"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$BACKUP_LOG"
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
    log_message "INFO" "$1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log_message "WARNING" "$1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log_message "ERROR" "$1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log_message "INFO" "$1"
}

# Backup başlangıç logu
log_message "BACKUP_START" "Backup işlemi başlatıldı - Tarih: $DATE"

# Check if running as deploy user
if [[ $EUID -eq 0 ]]; then
   print_error "Bu script root olarak çalıştırılmamalıdır!"
   exit 1
fi

# Create backup directory if not exists
mkdir -p $BACKUP_PATH
mkdir -p $(dirname $BACKUP_LOG)

# Navigate to current release
cd $CURRENT_PATH

# Get current commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B | head -1)

# Create app backup
print_status "Uygulama dosyaları yedekleniyor..."
APP_BACKUP_NAME="app_backup_${DATE}_${COMMIT_HASH}.tar.gz"
tar -czf "$BACKUP_PATH/$APP_BACKUP_NAME" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='*.log' \
    --exclude='.env*' \
    .

if [ $? -eq 0 ]; then
    print_status "✅ Uygulama backup başarılı: $APP_BACKUP_NAME"
    log_message "APP_BACKUP" "Uygulama backup başarılı: $APP_BACKUP_NAME"
else
    print_error "❌ Uygulama backup başarısız!"
    log_message "APP_BACKUP_ERROR" "Uygulama backup başarısız"
    exit 1
fi

# Create database backup (if MongoDB is used)
if command -v mongodump &> /dev/null; then
    print_status "Veritabanı yedekleniyor..."
    DB_BACKUP_NAME="db_backup_${DATE}.gz"
    mongodump --uri="mongodb://localhost:27017/birel" --archive="$BACKUP_PATH/$DB_BACKUP_NAME" --gzip
    
    if [ $? -eq 0 ]; then
        print_status "✅ Veritabanı backup başarılı: $DB_BACKUP_NAME"
        log_message "DB_BACKUP" "Veritabanı backup başarılı: $DB_BACKUP_NAME"
    else
        print_warning "⚠️ Veritabanı backup başarısız!"
        log_message "DB_BACKUP_ERROR" "Veritabanı backup başarısız"
    fi
else
    print_warning "MongoDB backup tool bulunamadı, veritabanı backup atlanıyor"
    log_message "DB_BACKUP_SKIP" "MongoDB backup tool bulunamadı"
fi

# Create logs backup
print_status "Log dosyaları yedekleniyor..."
LOGS_BACKUP_NAME="logs_backup_${DATE}.tar.gz"
tar -czf "$BACKUP_PATH/$LOGS_BACKUP_NAME" \
    /home/deploy/logs \
    /var/log/nginx/birelapp.*.log

if [ $? -eq 0 ]; then
    print_status "✅ Log backup başarılı: $LOGS_BACKUP_NAME"
    log_message "LOGS_BACKUP" "Log backup başarılı: $LOGS_BACKUP_NAME"
else
    print_warning "⚠️ Log backup başarısız!"
    log_message "LOGS_BACKUP_ERROR" "Log backup başarısız"
fi

# Create backup manifest
print_status "Backup manifest oluşturuluyor..."
MANIFEST_FILE="$BACKUP_PATH/backup_manifest_${DATE}.json"
cat > "$MANIFEST_FILE" << EOF
{
  "backup_date": "$(date -Iseconds)",
  "commit_hash": "$COMMIT_HASH",
  "commit_message": "$COMMIT_MESSAGE",
  "files": [
    {
      "name": "$APP_BACKUP_NAME",
      "type": "application",
      "size": "$(du -h "$BACKUP_PATH/$APP_BACKUP_NAME" | cut -f1)"
    }
EOF

if [ -f "$BACKUP_PATH/$DB_BACKUP_NAME" ]; then
    cat >> "$MANIFEST_FILE" << EOF
    ,{
      "name": "$DB_BACKUP_NAME",
      "type": "database",
      "size": "$(du -h "$BACKUP_PATH/$DB_BACKUP_NAME" | cut -f1)"
    }
EOF
fi

if [ -f "$BACKUP_PATH/$LOGS_BACKUP_NAME" ]; then
    cat >> "$MANIFEST_FILE" << EOF
    ,{
      "name": "$LOGS_BACKUP_NAME",
      "type": "logs",
      "size": "$(du -h "$BACKUP_PATH/$LOGS_BACKUP_NAME" | cut -f1)"
    }
EOF
fi

cat >> "$MANIFEST_FILE" << EOF
  ],
  "total_size": "$(du -sh "$BACKUP_PATH" | cut -f1)"
}
EOF

# Cleanup old backups (keep last 7 days)
print_status "Eski yedekler temizleniyor..."
find $BACKUP_PATH -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_PATH -name "*.gz" -mtime +7 -delete
find $BACKUP_PATH -name "backup_manifest_*.json" -mtime +7 -delete

# Calculate backup size
TOTAL_SIZE=$(du -sh "$BACKUP_PATH" | cut -f1)

# Backup completion log
log_message "BACKUP_SUCCESS" "Backup başarıyla tamamlandı - Toplam boyut: $TOTAL_SIZE"

print_status "🎉 Backup tamamlandı!"
print_info "Tarih: $DATE"
print_info "Commit: $COMMIT_HASH"
print_info "Mesaj: $COMMIT_MESSAGE"
print_info "Toplam boyut: $TOTAL_SIZE"
print_info "Backup dizini: $BACKUP_PATH"
print_info "Manifest: $MANIFEST_FILE"
