import { describe, expect, it } from 'vitest';
import { cn } from '../lib/utils';

describe('ui utils', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
