// API hata sınıfı
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Validation hatası
export class ValidationError extends ApiError {
  constructor(message: string, errors?: any[]) {
    super(400, message, errors);
    this.name = 'ValidationError';
  }
}

// Authentication hatası
export class AuthError extends ApiError {
  constructor(message: string = 'Yetkilendirme hatası') {
    super(401, message);
    this.name = 'AuthError';
  }
}

// Authorization hatası
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Bu işlem için yetkiniz yok') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

// Not Found hatası
export class NotFoundError extends ApiError {
  constructor(message: string = 'Kayıt bulunamadı') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

// Server hatası
export class ServerError extends ApiError {
  constructor(message: string = 'Sunucu hatası') {
    super(500, message);
    this.name = 'ServerError';
  }
}

// Global hata handler
export const handleApiError = (error: any) => {
  console.error('API Error:', error);

  // ApiError sınıfından türetilen hatalar
  if (error instanceof ApiError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      errors: error.errors
    };
  }

  // Mongoose validation hataları
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return {
      error: 'Validasyon hatası',
      statusCode: 400,
      errors
    };
  }

  // Mongoose duplicate key hatası
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      error: `${field} zaten kullanımda`,
      statusCode: 400
    };
  }

  // JWT hataları
  if (error.name === 'JsonWebTokenError') {
    return {
      error: 'Geçersiz token',
      statusCode: 401
    };
  }

  if (error.name === 'TokenExpiredError') {
    return {
      error: 'Token süresi dolmuş',
      statusCode: 401
    };
  }

  // Genel hata
  return {
    error: 'Bir hata oluştu',
    statusCode: 500
  };
};

// API response wrapper
export const apiResponse = {
  success: (data: any, message?: string) => ({
    success: true,
    data,
    message: message || 'İşlem başarılı'
  }),
  
  error: (error: string, statusCode: number = 500, errors?: any[]) => ({
    success: false,
    error,
    statusCode,
    errors
  })
};

// HTTP status kodları
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;
