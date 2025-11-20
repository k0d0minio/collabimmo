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

    // Validate response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: 'Réponse invalide du serveur',
      };
    }

    const result = await response.json() as ApiResponse<ContactFormResponse>;

    if (!response.ok) {
      // Include validation errors and detailed message in response
      const errorMessage = result.message || result.error || 'Une erreur est survenue lors de l\'envoi du formulaire';
      
      return {
        success: false,
        error: errorMessage,
        validationErrors: result.validationErrors || result.data?.validationErrors,
        message: result.message,
      };
    }

    return {
      success: true,
      data: result.data!,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

