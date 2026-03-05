export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  activeOrganizationId?: string | null;
}

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
