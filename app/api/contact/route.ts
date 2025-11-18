import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/validations';
import type { ContactFormRequest, ApiResponse, ContactFormResponse } from '@/types';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email';

async function validateTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormRequest = await request.json();

    // Validate Turnstile token
    if (!body.turnstileToken) {
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'CAPTCHA validation failed',
          data: {
            success: false,
            message: 'Veuillez compléter la vérification CAPTCHA',
          },
        },
        { status: 400 }
      );
    }

    const isTokenValid = await validateTurnstileToken(body.turnstileToken);
    
    if (!isTokenValid) {
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'CAPTCHA validation failed',
          data: {
            success: false,
            message: 'La vérification CAPTCHA a échoué. Veuillez réessayer.',
          },
        },
        { status: 400 }
      );
    }

    // Validate form data
    const formData = {
      firstname: body.firstname || '',
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      vatNumber: body.vatNumber || '',
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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Collabimmo <noreply@mail.jamienisbet.com>',
      to: [process.env.EMAIL_TO!],
      replyTo: formData.email,
      subject: `Nouveau message de contact - ${formData.firstname} ${formData.name}`,
      react: EmailTemplate({
        firstname: formData.firstname,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        vatNumber: formData.vatNumber || undefined,
        propertyType: formData.propertyType || undefined,
        message: formData.message,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'Failed to send email',
          data: {
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi du formulaire',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ContactFormResponse>>(
      {
        success: true,
        data: {
          success: true,
          message: 'Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.',
        },
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

