import type { ApiResponse, ContactFormRequest, ContactFormResponse } from '@/types';

export async function submitContactForm(
  data: ContactFormRequest
): Promise<ApiResponse<ContactFormResponse>> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Une erreur est survenue lors de l\'envoi du formulaire',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
    };
  }
}

