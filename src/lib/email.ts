import nodemailer from 'nodemailer';

// SMTP transporter oluşturma
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.birel.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // SSL/TLS
    auth: {
      user: process.env.SMTP_USER || 'info@birel.com',
      pass: process.env.SMTP_PASS || ''
    }
  });
};

// İletişim formu e-postası gönderme
export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    const transporter = createTransporter();
    
         const mailOptions = {
       from: process.env.SMTP_USER || 'info@birel.com', // DMARC uyumlu
       replyTo: data.email, // Kullanıcının e-postası Reply-To olarak
       to: 'info@birel.com',
      subject: `İletişim Formu: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Yeni İletişim Formu Mesajı</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ad Soyad:</strong> ${data.name}</p>
            <p><strong>E-posta:</strong> ${data.email}</p>
            <p><strong>Telefon:</strong> ${data.phone}</p>
            <p><strong>Konu:</strong> ${data.subject}</p>
            <p><strong>Mesaj:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Bu e-posta Bir El platformu iletişim formundan gönderilmiştir.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    throw new Error('E-posta gönderilemedi');
  }
};

// Görev bildirimi e-postası gönderme
export const sendTaskNotification = async (data: {
  to: string;
  subject: string;
  message: string;
  taskTitle?: string;
}) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'info@birel.com',
      to: data.to,
      subject: data.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Bir El Platformu</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${data.taskTitle ? `<h3>Görev: ${data.taskTitle}</h3>` : ''}
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Bu e-posta Bir El platformundan otomatik olarak gönderilmiştir.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Bildirim e-postası gönderme hatası:', error);
    throw new Error('Bildirim e-postası gönderilemedi');
  }
};

// E-posta doğrulama
export const sendVerificationEmail = async (data: {
  to: string;
  name: string;
  verificationToken: string;
}) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${data.verificationToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'info@birel.com',
      to: data.to,
      subject: 'Bir El - E-posta Doğrulama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">E-posta Adresinizi Doğrulayın</h2>
          <p>Merhaba ${data.name},</p>
          <p>Bir El platformuna hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              E-posta Adresimi Doğrula
            </a>
          </div>
          <p>Bu link 24 saat geçerlidir.</p>
          <p style="color: #6b7280; font-size: 14px;">
            Bu e-posta Bir El platformundan otomatik olarak gönderilmiştir.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Doğrulama e-postası gönderme hatası:', error);
    throw new Error('Doğrulama e-postası gönderilemedi');
  }
};
