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
  sortBy: z
    .enum(['name', 'role', 'technologies', 'expectedSalary', 'available', 'status', 'createdAt'])
    .default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc')
});

export const createCandidateInviteLinkSchema = z.object({
  candidateId: z.string().min(1),
  expirationDate: z.string().datetime().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type CandidateQueryInput = z.infer<typeof candidateQuerySchema>;
export type CreateCandidateInviteLinkInput = z.infer<typeof createCandidateInviteLinkSchema>;
