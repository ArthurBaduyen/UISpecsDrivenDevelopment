import { describe, expect, it } from 'vitest';
import { parseWebEnv } from '../lib/env';

describe('parseWebEnv', () => {
  it('returns defaults when env is missing', () => {
    const parsed = parseWebEnv({});
    expect(parsed.NEXTAUTH_URL).toBe('http://localhost:3000');
    expect(parsed.NEXT_PUBLIC_API_URL).toBe('http://localhost:4000');
  });
});
