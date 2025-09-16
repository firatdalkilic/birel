import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendContactEmail } from '@/lib/email';
import { handleApiError, apiResponse, HTTP_STATUS } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Form verilerini doğrula
    const validatedData = contactSchema.parse(body);
    
    // E-posta gönder
    await sendContactEmail(validatedData);
    
    return NextResponse.json(
      apiResponse.success(null, 'Mesajınız başarıyla gönderildi'),
      { status: HTTP_STATUS.CREATED }
    );
    
  } catch (error) {
    const errorResponse = handleApiError(error);
    
    return NextResponse.json(
      apiResponse.error(errorResponse.error, errorResponse.statusCode, errorResponse.errors),
      { status: errorResponse.statusCode }
    );
  }
}
