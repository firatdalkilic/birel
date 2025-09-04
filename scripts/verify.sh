#!/usr/bin/env bash
set -e

echo "=== Bir El App - Doğrulama Script'i ==="
echo "Tarih: $(date)"
echo ""

echo "== Webhook Health Check =="
curl -s -i http://webhook.birelapp.com/health | awk 'BEGIN{limit=0}/X-RateLimit-Limit/{print;limit=$2}END{if(limit==20)print "✅ OK: RateLimit 20"; else print "❌ WARN: RateLimit not 20"}'
echo ""

echo "== App Health Check =="
curl -s -i http://birelapp.com/api/health | head -n 20
echo ""

echo "== Build Test =="
echo "Next.js build test başlatılıyor..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build başarılı!"
else
    echo "❌ Build başarısız!"
fi
echo ""

echo "== Path Alias Test =="
echo "TSConfig path mapping kontrol ediliyor..."
if grep -q '"@/\*": \["src/\*"\]' tsconfig.json; then
    echo "✅ TSConfig path mapping doğru"
else
    echo "❌ TSConfig path mapping hatalı"
fi
echo ""

echo "== Dependencies Check =="
echo "DevDependencies kontrol ediliyor..."
if grep -q '"autoprefixer": "\^10.4.20"' package.json && grep -q '"postcss": "\^8.4.47"' package.json && grep -q '"tailwindcss": "\^3.4.10"' package.json; then
    echo "✅ DevDependencies doğru"
else
    echo "❌ DevDependencies eksik/hatalı"
fi
echo ""

echo "== File Existence Check =="
if [ -f "src/store/authStore.ts" ]; then
    echo "✅ authStore.ts mevcut"
else
    echo "❌ authStore.ts eksik"
fi

if [ -f "src/components/StarRating.tsx" ]; then
    echo "✅ StarRating.tsx mevcut"
else
    echo "❌ StarRating.tsx eksik"
fi

if [ -f "src/components/ReviewsList.tsx" ]; then
    echo "✅ ReviewsList.tsx mevcut"
else
    echo "❌ ReviewsList.tsx eksik"
fi
echo ""

echo "=== Doğrulama Tamamlandı ==="
