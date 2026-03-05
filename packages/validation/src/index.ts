import { z } from 'zod';

export const roleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);

export const userRoleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'CANDIDATE', 'CLIENT']);

export const createProjectSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional()
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    description: z.string().max(500).nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  });

export const projectIdParamSchema = z.object({
  id: z.string().min(1)
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const candidateStatusSchema = z.enum(['Active', 'Inactive', 'Pending']);

export const createCandidateSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  technologies: z.string().min(2),
  expectedSalary: z.string().min(1),
  available: z.string().min(1),
  status: candidateStatusSchema.default('Pending'),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional()
});

export const updateCandidateSchema = createCandidateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  });

export const candidateIdParamSchema = z.object({
  id: z.string().min(1)
});

export const candidateQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  status: candidateStatusSchema.optional(),
  role: z.string().optional(),
  available: z.string().optional(),
  sortBy: z
    .enum(['name', 'role', 'technologies', 'expectedSalary', 'available', 'status', 'createdAt'])
    .default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc')
});

export const createCandidateInviteLinkSchema = z.object({
  candidateId: z.string().min(1),
  expirationDate: z.string().datetime().optional()
});

export const capabilityLevels = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Senior Lead Level'
] as const;

export const skillCapabilitySchema = z.object({
  'Entry Level': z.array(z.string().min(1)).default([]),
  'Mid Level': z.array(z.string().min(1)).default([]),
  'Senior Level': z.array(z.string().min(1)).default([]),
  'Senior Lead Level': z.array(z.string().min(1)).default([])
});

export const skillInputSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  code: z.string().min(1).optional().nullable(),
  description: z.string().optional().nullable(),
  capabilities: skillCapabilitySchema,
  displayOrder: z.number().int().min(0).default(0)
});

export const skillCategoryInputSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
  skills: z.array(skillInputSchema).default([])
});

export const putSkillsTaxonomySchema = z.object({
  taxonomyVersion: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
  categories: z.array(skillCategoryInputSchema)
});

export const skillsQuerySchema = z
  .object({
    scope: z.enum(['categories', 'skills']).default('categories'),
    categoryId: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortDir: z.enum(['asc', 'desc']).default('asc')
  })
  .superRefine((value, ctx) => {
    if (value.scope === 'skills' && !value.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'categoryId is required when scope=skills',
        path: ['categoryId']
      });
    }
  });

export const sharedProfileStatusSchema = z.enum(['Active', 'Expired', 'Revoked']);

export const createSharedProfileSchema = z.object({
  candidateId: z.string().min(1),
  sharedWithName: z.string().min(1),
  sharedWithEmail: z.string().email(),
  rateLabel: z.string().min(1),
  expirationDate: z.string().datetime()
});

export const updateSharedProfileSchema = z
  .object({
    rateLabel: z.string().min(1).optional(),
    expirationDate: z.string().datetime().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  });

export const sharedProfileIdParamSchema = z.object({
  id: z.string().min(1)
});

export const sharedProfilesQuerySchema = z.object({
  q: z.string().optional(),
  status: sharedProfileStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum([
      'candidateName',
      'sharedWithName',
      'rateLabel',
      'expirationDate',
      'accessCount',
      'sharedAt',
      'updatedAt'
    ])
    .default('sharedAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc')
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type CandidateQueryInput = z.infer<typeof candidateQuerySchema>;
export type CreateCandidateInviteLinkInput = z.infer<typeof createCandidateInviteLinkSchema>;
export type PutSkillsTaxonomyInput = z.infer<typeof putSkillsTaxonomySchema>;
export type SkillsQueryInput = z.infer<typeof skillsQuerySchema>;
export type CreateSharedProfileInput = z.infer<typeof createSharedProfileSchema>;
export type UpdateSharedProfileInput = z.infer<typeof updateSharedProfileSchema>;
export type SharedProfilesQueryInput = z.infer<typeof sharedProfilesQuerySchema>;
