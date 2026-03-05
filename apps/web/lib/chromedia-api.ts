export type SessionUser = {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CANDIDATE' | 'CLIENT';
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  technologies: string;
  expectedSalary: string;
  available: string;
  status: 'Active' | 'Inactive' | 'Pending';
  email?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CandidateQueryResponse = {
  items: Candidate[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ message: 'Request failed' }))) as {
      message?: string;
    };
    throw new Error(payload.message ?? 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getSession(): Promise<{ authenticated: boolean; user?: SessionUser }> {
  return apiFetch<{ authenticated: boolean; user?: SessionUser }>('/auth/session', {
    method: 'GET'
  });
}
