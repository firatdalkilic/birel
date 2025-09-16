import { z } from "zod";

// Kullanıcı kayıt validasyonu
export const registerSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().regex(/^\+90[0-9]{10}$/, "Telefon numarası +90 ile başlamalı ve 10 haneli olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"]
});

// Giriş validasyonu
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir")
});

// Görev oluşturma validasyonu
export const taskSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır"),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalıdır"),
  category: z.string().min(1, "Kategori seçiniz"),
  budget: z.number().min(1, "Bütçe en az 1 TL olmalıdır"),
  location: z.string().min(3, "Konum en az 3 karakter olmalıdır"),
  deadline: z.date().optional(),
  urgency: z.enum(["low", "medium", "high"]).default("medium")
});

// İletişim formu validasyonu
export const contactSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Telefon numarası en az 10 karakter olmalıdır"),
  subject: z.string().min(5, "Konu en az 5 karakter olmalıdır"),
  message: z.string().min(20, "Mesaj en az 20 karakter olmalıdır")
});

// Teklif validasyonu
export const offerSchema = z.object({
  amount: z.number().min(1, "Teklif tutarı en az 1 TL olmalıdır"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır")
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type OfferFormData = z.infer<typeof offerSchema>;
