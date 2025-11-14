import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/validations';
import type { ContactFormRequest, ApiResponse, ContactFormResponse } from '@/types';
import { CONTACT_EMAIL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormRequest = await request.json();

    // Validate form data
    const formData = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      propertyType: body.propertyType || '',
      consent: true, // Assuming consent is handled client-side
    };

    const errors = validateContactForm(formData);
    
    if (Object.keys(errors).length > 0) {
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'Validation failed',
          data: {
            success: false,
            message: 'Veuillez corriger les erreurs du formulaire',
          },
        },
        { status: 400 }
      );
    }

    // TODO: Implement email sending
    // TODO: Implement database/CRM storage
    // TODO: Add spam protection (reCAPTCHA)
    
    // Placeholder response
    const response: ContactFormResponse = {
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.',
    };

    // In production, you would:
    // 1. Send email to CONTACT_EMAIL
    // 2. Store submission in database/CRM
    // 3. Send auto-reply to submitter (optional)
    // 4. Log the submission

    return NextResponse.json<ApiResponse<ContactFormResponse>>(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json<ApiResponse<ContactFormResponse>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
        data: {
          success: false,
          message: 'Une erreur est survenue lors de l\'envoi du formulaire',
        },
      },
      { status: 500 }
    );
  }
}

