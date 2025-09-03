#!/bin/bash

# Bir El App - Cron Job Kurulum Script'i
# Bu script otomatik backup ve maintenance işlemlerini ayarlar

set -e

echo "🚀 Cron Job Sistemi Kuruluyor..."

# Environment variables
BACKUP_SCRIPT="/var/www/birelapp/backup.sh"
LOG_ROTATE_SCRIPT="/var/www/birelapp/log-rotate.sh"
MAINTENANCE_SCRIPT="/var/www/birelapp/maintenance.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "Bu script root olarak çalıştırılmamalıdır!"
   exit 1
fi

# Make scripts executable
print_status "Script'ler çalıştırılabilir yapılıyor..."
chmod +x $BACKUP_SCRIPT

# Create log rotate script
print_status "Log rotate script oluşturuluyor..."
cat > $LOG_ROTATE_SCRIPT << 'EOF'
#!/bin/bash

# Log rotate script
LOG_DIRS=("/var/log/birelapp" "/var/log/webhook" "/var/log/nginx")

for dir in "${LOG_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        find "$dir" -name "*.log" -size +100M -exec truncate -s 50M {} \;
        find "$dir" -name "*.log.*" -mtime +7 -delete
    fi
done

echo "$(date): Log rotate completed" >> /var/log/birelapp/cron.log
EOF

chmod +x $LOG_ROTATE_SCRIPT

# Create maintenance script
print_status "Maintenance script oluşturuluyor..."
cat > $MAINTENANCE_SCRIPT << 'EOF'
#!/bin/bash

# Maintenance script
echo "$(date): Starting maintenance..." >> /var/log/birelapp/cron.log

# Clean npm cache
npm cache clean --force

# Clean PM2 logs
pm2 flush

# Restart PM2 processes if needed
pm2 restart birel-app

# Clean old files
find /var/www/birelapp -name "*.tmp" -delete
find /var/www/birelapp -name "*.log" -size +50M -delete

echo "$(date): Maintenance completed" >> /var/log/birelapp/cron.log
EOF

chmod +x $MAINTENANCE_SCRIPT

# Get current crontab
print_status "Mevcut crontab alınıyor..."
CURRENT_CRON=$(crontab -l 2>/dev/null || echo "")

# Create new crontab entries
print_status "Cron job'lar ekleniyor..."

# Daily backup at 2 AM
BACKUP_CRON="0 2 * * * $BACKUP_SCRIPT >> /var/log/birelapp/cron.log 2>&1"

# Log rotate every 6 hours
LOG_ROTATE_CRON="0 */6 * * * $LOG_ROTATE_SCRIPT"

# Weekly maintenance on Sunday at 3 AM
MAINTENANCE_CRON="0 3 * * 0 $MAINTENANCE_SCRIPT"

# Check if entries already exist
if echo "$CURRENT_CRON" | grep -q "$BACKUP_SCRIPT"; then
    print_warning "Backup cron job zaten mevcut"
else
    CURRENT_CRON="$CURRENT_CRON"$'\n'"$BACKUP_CRON"
fi

if echo "$CURRENT_CRON" | grep -q "$LOG_ROTATE_SCRIPT"; then
    print_warning "Log rotate cron job zaten mevcut"
else
    CURRENT_CRON="$CURRENT_CRON"$'\n'"$LOG_ROTATE_CRON"
fi

if echo "$CURRENT_CRON" | grep -q "$MAINTENANCE_SCRIPT"; then
    print_warning "Maintenance cron job zaten mevcut"
else
    CURRENT_CRON="$CURRENT_CRON"$'\n'"$MAINTENANCE_CRON"
fi

# Install new crontab
echo "$CURRENT_CRON" | crontab -

print_status "✅ Cron job'lar başarıyla eklendi!"

print_info "📋 Eklenen Cron Job'lar:"
echo "  - Günlük backup: 02:00 (her gün)"
echo "  - Log rotate: Her 6 saatte bir"
echo "  - Maintenance: 03:00 (her Pazar)"

print_info "📁 Script konumları:"
echo "  - Backup: $BACKUP_SCRIPT"
echo "  - Log rotate: $LOG_ROTATE_SCRIPT"
echo "  - Maintenance: $MAINTENANCE_SCRIPT"

print_info "📊 Log dosyası: /var/log/birelapp/cron.log"

print_status "🔧 Yardımcı komutlar:"
echo "  - Cron job'ları listele: crontab -l"
echo "  - Cron log'larını görüntüle: tail -f /var/log/birelapp/cron.log"
echo "  - Cron service durumu: sudo systemctl status cron"
