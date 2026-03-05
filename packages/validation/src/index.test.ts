import { describe, expect, it } from 'vitest';
import { createProjectSchema, updateProjectSchema } from './index';

describe('project schemas', () => {
  it('accepts a valid create payload', () => {
    const parsed = createProjectSchema.parse({
      organizationId: 'org_123',
      name: 'Roadmap',
      description: 'Initial project'
    });

    expect(parsed.name).toBe('Roadmap');
  });

  it('rejects empty update payload', () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
