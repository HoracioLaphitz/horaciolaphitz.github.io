/**
 * API Client: Contact
 * Envío del formulario de contacto al backend Django
 */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitContact(data: ContactPayload): Promise<ContactResponse> {
  const response = await fetch('/api/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || `Error ${response.status}: ${response.statusText}`,
    };
  }

  return await response.json();
}
