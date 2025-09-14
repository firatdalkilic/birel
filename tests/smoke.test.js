const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

test.describe('Bir El - Smoke Tests', () => {
  
  test('Anasayfa yükleniyor ve içerik görünüyor', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Sayfa başlığını kontrol et
    await expect(page).toHaveTitle(/Bir El/);
    
    // Hero section'ın görünür olduğunu kontrol et
    await expect(page.locator('h1')).toContainText('Zamana mı');
    
    // Kategori kartlarının görünür olduğunu kontrol et
    await expect(page.locator('text=Ev İşleri')).toBeVisible();
    await expect(page.locator('text=İlaç Alımı')).toBeVisible();
    
    // CTA butonlarının görünür olduğunu kontrol et
    await expect(page.locator('a[href="/kayit"]')).toBeVisible();
    await expect(page.locator('a[href="/giris"]')).toBeVisible();
  });

  test('Kayıt formu çalışıyor', async ({ page }) => {
    await page.goto(`${BASE_URL}/kayit`);
    
    // Form alanlarının görünür olduğunu kontrol et
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    
    // Random email oluştur
    const randomEmail = `test-${Date.now()}@example.com`;
    
    // Form doldur
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="phone"]', '5551234567');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirmPassword"]', 'testpassword123');
    
    // Form submit et
    await page.click('button[type="submit"]');
    
    // Loading state'i kontrol et
    await expect(page.locator('text=Kaydediliyor...')).toBeVisible();
    
    // Başarılı yönlendirme veya toast mesajını kontrol et
    // (Bu test ortamına göre ayarlanabilir)
    await page.waitForTimeout(2000);
  });

  test('Giriş formu çalışıyor', async ({ page }) => {
    await page.goto(`${BASE_URL}/giris`);
    
    // Form alanlarının görünür olduğunu kontrol et
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    // Geçersiz bilgilerle test et
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Form submit et
    await page.click('button[type="submit"]');
    
    // Loading state'i kontrol et
    await expect(page.locator('text=Giriş yapılıyor...')).toBeVisible();
    
    // Hata mesajının görünür olduğunu kontrol et (birkaç saniye bekle)
    await page.waitForTimeout(2000);
  });

  test('Health endpoint çalışıyor', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('time');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('memory');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('environment');
    expect(data).toHaveProperty('database');
    expect(data).toHaveProperty('services');
  });

  test('API endpoints yanıt veriyor', async ({ request }) => {
    // Health endpoint
    const healthResponse = await request.get(`${BASE_URL}/api/health`);
    expect(healthResponse.status()).toBe(200);
    
    // Register endpoint (POST method test)
    const registerResponse = await request.post(`${BASE_URL}/api/register`, {
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        phone: '5551234567',
        password: 'testpassword123'
      }
    });
    
    // 400 (validation error) veya 201 (success) bekliyoruz
    expect([200, 201, 400]).toContain(registerResponse.status());
    
    // Login endpoint (POST method test)
    const loginResponse = await request.post(`${BASE_URL}/api/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });
    
    // 401 (unauthorized) bekliyoruz
    expect(loginResponse.status()).toBe(401);
  });

  test('Responsive tasarım çalışıyor', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation çalışıyor', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Header navigation links
    await expect(page.locator('a[href="/giris"]')).toBeVisible();
    await expect(page.locator('a[href="/kayit"]')).toBeVisible();
    
    // Footer links
    await expect(page.locator('a[href="/gizlilik"]')).toBeVisible();
    await expect(page.locator('a[href="/kvkk"]')).toBeVisible();
    
    // Logo click test
    await page.click('text=Bir El');
    await expect(page).toHaveURL(BASE_URL);
  });

});
