import { describe, expect, it } from 'vitest';
import { isNonEmptyString } from './index';

describe('isNonEmptyString', () => {
  it('returns true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
  });

  it('returns false for empty or non-string values', () => {
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });
});
