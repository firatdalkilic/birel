#!/bin/bash

# Bir El App - Otomatik Deployment Script
# Bu script GitHub webhook tarafından tetiklenir

set -e

# Environment variables
APP_NAME="birel-web"
WEBHOOK_NAME="birel-webhook"
DEPLOY_PATH="/var/www/birel"
RELEASES_PATH="$DEPLOY_PATH/releases"
CURRENT_PATH="$DEPLOY_PATH/current"
BACKUP_PATH="/home/deploy/backups"
LOG_PATH="/home/deploy/logs"

# Webhook parametreleri
REF="$1"
REPO_NAME="$2"
PUSHER_NAME="$3"
DEPLOY_TIME=$(date '+%Y-%m-%d %H:%M:%S')
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_PATH="$RELEASES_PATH/$TIMESTAMP"

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
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_PATH/deploy.log"
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

# Deployment başlangıç logu
log_message "DEPLOY_START" "Deployment başlatıldı - Ref: $REF, Repo: $REPO_NAME, Pusher: $PUSHER_NAME"

# Check if running as deploy user
if [[ $EUID -eq 0 ]]; then
   print_error "Bu script root olarak çalıştırılmamalıdır!"
   exit 1
fi

# Check if deployment path exists
if [ ! -d "$DEPLOY_PATH" ]; then
    print_error "Deployment path bulunamadı: $DEPLOY_PATH"
    exit 1
fi

# Create necessary directories
print_status "Gerekli dizinler kontrol ediliyor..."
mkdir -p $RELEASES_PATH
mkdir -p $BACKUP_PATH
mkdir -p $LOG_PATH

# Navigate to current release
cd $CURRENT_PATH

# Check if git repository is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Git repository temiz değil, stash yapılıyor..."
    git stash
fi

# Pull latest changes
print_status "En son değişiklikler çekiliyor..."
git fetch origin
git reset --hard origin/main
git clean -fd

# Get commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)
log_message "GIT_PULL" "Commit: $COMMIT_HASH - $COMMIT_MESSAGE"

# Create new release directory
print_status "Yeni release dizini oluşturuluyor..."
mkdir -p $RELEASE_PATH

# Copy files to new release
print_status "Dosyalar yeni release'e kopyalanıyor..."
cp -r . $RELEASE_PATH/

# Navigate to new release
cd $RELEASE_PATH

# Install dependencies
print_status "Bağımlılıklar yükleniyor..."
npm ci --production --silent
if [ $? -eq 0 ]; then
    log_message "NPM_INSTALL" "Bağımlılıklar başarıyla yüklendi"
else
    print_error "Bağımlılık yükleme başarısız!"
    log_message "NPM_INSTALL_ERROR" "Bağımlılık yükleme başarısız"
    exit 1
fi

# Build the application
print_status "Uygulama build ediliyor..."
npm run build
if [ $? -eq 0 ]; then
    log_message "BUILD" "Build başarılı"
else
    print_error "Build başarısız!"
    log_message "BUILD_ERROR" "Build başarısız"
    exit 1
fi

# Set proper permissions
print_status "Dosya izinleri ayarlanıyor..."
sudo chown -R www-data:www-data $RELEASE_PATH
sudo chmod -R 755 $RELEASE_PATH

# Update current symlink
print_status "Current symlink güncelleniyor..."
ln -sfn $RELEASE_PATH $CURRENT_PATH

# Reload PM2 process
print_status "PM2 process yeniden başlatılıyor..."
pm2 reload $APP_NAME

# Check if the application is running
sleep 5
if pm2 list | grep -q $APP_NAME; then
    print_status "✅ Uygulama başarıyla başlatıldı!"
    log_message "PM2_START" "Uygulama başarıyla başlatıldı"
else
    print_error "❌ Uygulama başlatılamadı!"
    log_message "PM2_START_ERROR" "Uygulama başlatılamadı"
    pm2 logs $APP_NAME --lines 20
    exit 1
fi

# Health check
print_status "Health check yapılıyor..."
HEALTH_CHECK_RETRIES=3
HEALTH_CHECK_DELAY=5

for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "✅ Health check başarılı! (Deneme: $i/$HEALTH_CHECK_RETRIES)"
        log_message "HEALTH_CHECK" "Health check başarılı - Deneme: $i"
        break
    else
        if [ $i -eq $HEALTH_CHECK_RETRIES ]; then
            print_warning "⚠️ Health check başarısız, ancak uygulama çalışıyor olabilir"
            log_message "HEALTH_CHECK_WARNING" "Health check başarısız - Son deneme"
        else
            print_warning "Health check başarısız, $HEALTH_CHECK_DELAY saniye sonra tekrar deneniyor... (Deneme: $i/$HEALTH_CHECK_RETRIES)"
            sleep $HEALTH_CHECK_DELAY
        fi
    fi
done

# Reload Nginx
print_status "Nginx yeniden yükleniyor..."
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    log_message "NGINX_RELOAD" "Nginx başarıyla yeniden yüklendi"
else
    print_warning "Nginx yeniden yükleme başarısız!"
    log_message "NGINX_RELOAD_ERROR" "Nginx yeniden yükleme başarısız"
fi

# Cleanup old releases (keep last 5)
print_status "Eski release'ler temizleniyor..."
cd $RELEASES_PATH
ls -t | tail -n +6 | xargs -r rm -rf
log_message "CLEANUP" "Eski release'ler temizlendi"

# Deployment completion log
log_message "DEPLOY_SUCCESS" "Deployment başarıyla tamamlandı - Commit: $COMMIT_HASH"

print_status "🎉 Deployment tamamlandı!"
print_info "Commit: $COMMIT_HASH"
print_info "Mesaj: $COMMIT_MESSAGE"
print_info "Pusher: $PUSHER_NAME"
print_info "Release: $RELEASE_PATH"
print_info "Uygulama: https://birelapp.com"
print_info "PM2 Status: pm2 status"
print_info "Logs: pm2 logs $APP_NAME"
print_info "Deploy Log: $LOG_PATH/deploy.log"

# Send notification (optional)
if command -v curl &> /dev/null; then
    # Slack/Discord webhook notification (isteğe bağlı)
    # curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"🚀 Bir El App deployed successfully! Commit: $COMMIT_HASH\"}" $SLACK_WEBHOOK_URL
    true
fi
