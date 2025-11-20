import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/validations';
import type { ContactFormRequest, ApiResponse, ContactFormResponse } from '@/types';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email';
import { env } from '@/lib/env';

// Maximum request body size (10KB)
const MAX_REQUEST_SIZE = 10 * 1024;

async function validateTurnstileToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(env.turnstile.verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.turnstile.secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    // Log error in development, but don't expose details in production
    if (env.isDevelopment()) {
      console.error('Turnstile validation error:', error);
    }
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'Request too large',
          data: {
            success: false,
            message: 'La requête est trop volumineuse. Veuillez réduire la taille de votre message.',
          },
        },
        { status: 413 }
      );
    }

    // Parse request body with error handling
    let body: ContactFormRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json<ApiResponse<ContactFormResponse>>(
        {
          success: false,
          error: 'Invalid JSON',
          data: {
            success: false,
            message: 'Format de requête invalide.',
          },
        },
        { status: 400 }
      );
    }

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
      consent: body.consent ?? false, // Use actual consent value from request
      turnstileToken: body.turnstileToken || '',
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

    const resend = new Resend(env.resend.apiKey);

    const { data, error } = await resend.emails.send({
      from: env.resend.fromEmail,
      to: [env.emailTo],
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
      // Log error in development, but don't expose details in production
      if (env.isDevelopment()) {
        console.error('Resend error:', error);
      }
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
    // Log error in development, but don't expose details in production
    if (env.isDevelopment()) {
      console.error('Contact form submission error:', error);
    }
    
    return NextResponse.json<ApiResponse<ContactFormResponse>>(
      {
        success: false,
        error: 'Internal server error',
        data: {
          success: false,
          message: 'Une erreur est survenue lors de l\'envoi du formulaire',
        },
      },
      { status: 500 }
    );
  }
}

