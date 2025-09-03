#!/bin/bash

# Bir El App - Webhook Kurulum Script'i
# Bu script webhook sunucusunu kurar ve yapılandırır

set -e

echo "🚀 Webhook Sistemi Kuruluyor..."

# Environment variables
WEBHOOK_PATH="/opt/birel-webhook"
WEBHOOK_PORT=3200
WEBHOOK_SECRET=$(openssl rand -hex 32)

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

# Check if running as deploy user
if [[ $EUID -eq 0 ]]; then
   print_error "Bu script root olarak çalıştırılmamalıdır!"
   exit 1
fi

print_status "Sistem güncelleniyor..."
sudo apt update

print_status "Gerekli paketler kuruluyor..."
sudo apt install -y curl wget git nginx nodejs npm

# Node.js 18.x kurulumu (eğer yoksa)
if ! command -v node &> /dev/null || [[ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    print_status "Node.js 18.x kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# PM2 kurulumu
print_status "PM2 kuruluyor..."
sudo npm install -g pm2

# Gerekli dizinler oluşturma
print_status "Gerekli dizinler oluşturuluyor..."
sudo mkdir -p $WEBHOOK_PATH
sudo chown -R $USER:$USER $WEBHOOK_PATH

# Webhook server dosyasını kopyala
print_status "Webhook server dosyası kopyalanıyor..."
cp webhook-server.js $WEBHOOK_PATH/

# Package.json oluştur
print_status "Package.json oluşturuluyor..."
cat > $WEBHOOK_PATH/package.json << EOF
{
  "name": "birel-webhook",
  "version": "1.0.0",
  "description": "Bir El Webhook Server",
  "main": "webhook-server.js",
  "scripts": {
    "start": "node webhook-server.js",
    "dev": "nodemon webhook-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "keywords": ["webhook", "deployment", "ci-cd"],
  "author": "Bir El Team",
  "license": "MIT"
}
EOF

# Bağımlılıkları yükle
print_status "Webhook bağımlılıkları yükleniyor..."
cd $WEBHOOK_PATH
npm install --production

# Environment dosyası oluştur
print_status "Environment dosyası oluşturuluyor..."
cat > $WEBHOOK_PATH/.env << EOF
NODE_ENV=production
WEBHOOK_PORT=$WEBHOOK_PORT
WEBHOOK_SECRET=$WEBHOOK_SECRET
EOF

# Webhook secret'ını ana .env dosyasına da ekle
print_status "Webhook secret ana .env dosyasına ekleniyor..."
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" >> /var/www/birel/.env

# PM2 ile webhook'u başlat
print_status "PM2 ile webhook başlatılıyor..."
pm2 start ecosystem.config.js --only birel-webhook
pm2 save

# Nginx reverse proxy konfigürasyonu
print_status "Nginx reverse proxy konfigürasyonu oluşturuluyor..."
sudo tee /etc/nginx/sites-available/webhook << EOF
server {
    listen 80;
    server_name webhook.birelapp.com;
    
    location / {
        proxy_pass http://localhost:$WEBHOOK_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
EOF

# Nginx site'ını etkinleştir
sudo ln -sf /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Firewall ayarları
print_status "Firewall ayarları yapılıyor..."
sudo ufw allow $WEBHOOK_PORT/tcp
sudo ufw reload

print_status "✅ Webhook sistemi kuruldu!"
print_info "Webhook URL: http://webhook.birelapp.com/webhooks/birel-deploy"
print_info "Webhook Secret: $WEBHOOK_SECRET"
print_info "Webhook Port: $WEBHOOK_PORT"
print_info "Webhook Path: $WEBHOOK_PATH"

echo ""
print_status "📋 Sonraki adımlar:"
echo "1. GitHub'da webhook ayarlarını yapın"
echo "2. Test deployment yapın"
echo ""
print_status "🔧 Yardımcı komutlar:"
echo "- Webhook durumu: pm2 status birel-webhook"
echo "- Webhook logları: pm2 logs birel-webhook"
echo "- Webhook restart: pm2 restart birel-webhook"
echo "- Nginx restart: sudo systemctl restart nginx"
