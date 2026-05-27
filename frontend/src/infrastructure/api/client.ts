const BASE_URL = '/api/v1';

interface RequestOptions {
  params?: Record<string, string | undefined>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      body
    );
  }

  return response.json() as Promise<T>;
}

async function postRequest<T>(path: string, body: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null);
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      responseBody
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
    return request<T>(path, { params });
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return postRequest<T>(path, body);
  },
};
