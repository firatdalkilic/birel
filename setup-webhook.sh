#!/bin/bash

# Bir El App - Otomatik Deployment Sistemi Kurulumu
# Bu script webhook tabanlı CI/CD sistemi kurar

set -e

echo "🚀 Otomatik Deployment Sistemi Kuruluyor..."

# Environment variables
APP_NAME="birel-app"
WEBHOOK_NAME="birel-webhook"
DEPLOY_PATH="/var/www/birelapp"
WEBHOOK_PATH="/var/www/webhook"
WEBHOOK_PORT=9000
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

# Check if running as root
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

# Webhook kurulumu
print_status "Webhook kuruluyor..."
sudo npm install -g webhook

# Gerekli dizinler oluşturma
print_status "Gerekli dizinler oluşturuluyor..."
sudo mkdir -p $WEBHOOK_PATH
sudo mkdir -p $WEBHOOK_PATH/hooks
sudo mkdir -p $WEBHOOK_PATH/logs
sudo chown -R $USER:$USER $WEBHOOK_PATH

# Webhook konfigürasyonu oluşturma
print_status "Webhook konfigürasyonu oluşturuluyor..."
cat > $WEBHOOK_PATH/hooks.json << EOF
[
  {
    "id": "birel-deploy",
    "execute-command": "$DEPLOY_PATH/deploy.sh",
    "command-working-directory": "$DEPLOY_PATH",
    "pass-arguments-to-command": [
      {
        "source": "payload",
        "name": "ref"
      },
      {
        "source": "payload",
        "name": "repository.name"
      },
      {
        "source": "payload",
        "name": "pusher.name"
      }
    ],
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hash-sha256",
            "secret": "$WEBHOOK_SECRET",
            "parameter": {
              "source": "request",
              "name": "X-Hub-Signature-256"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/main",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
EOF

# Webhook systemd service oluşturma
print_status "Webhook systemd service oluşturuluyor..."
sudo tee /etc/systemd/system/webhook.service > /dev/null << EOF
[Unit]
Description=Webhook Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WEBHOOK_PATH
ExecStart=/usr/bin/webhook -hooks hooks.json -port $WEBHOOK_PORT -verbose
Restart=always
RestartSec=10
StandardOutput=append:/var/log/webhook/webhook.log
StandardError=append:/var/log/webhook/webhook.log

[Install]
WantedBy=multi-user.target
EOF

# Log dizini oluşturma
sudo mkdir -p /var/log/webhook
sudo chown -R $USER:$USER /var/log/webhook

# Webhook service'i etkinleştirme
print_status "Webhook service etkinleştiriliyor..."
sudo systemctl daemon-reload
sudo systemctl enable webhook
sudo systemctl start webhook

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

# Nginx site'ını etkinleştirme
sudo ln -sf /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Firewall ayarları
print_status "Firewall ayarları yapılıyor..."
sudo ufw allow 9000/tcp
sudo ufw reload

# Webhook secret'ını kaydetme
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET" | sudo tee -a /etc/environment

print_status "✅ Webhook sistemi kuruldu!"
print_info "Webhook URL: http://webhook.birelapp.com/webhooks/birel-deploy"
print_info "Webhook Secret: $WEBHOOK_SECRET"
print_info "Webhook Logs: /var/log/webhook/webhook.log"
print_info "Service Status: sudo systemctl status webhook"

echo ""
print_status "📋 Sonraki adımlar:"
echo "1. GitHub'da webhook ayarlarını yapın"
echo "2. deploy.sh script'ini güncelleyin"
echo "3. Test deployment yapın"
echo ""
print_status "🔧 Yardımcı komutlar:"
echo "- Webhook durumu: sudo systemctl status webhook"
echo "- Webhook logları: tail -f /var/log/webhook/webhook.log"
echo "- Webhook restart: sudo systemctl restart webhook"
echo "- Nginx restart: sudo systemctl restart nginx"
