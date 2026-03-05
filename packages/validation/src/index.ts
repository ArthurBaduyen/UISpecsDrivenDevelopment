import { z } from 'zod';

export const roleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);

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

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
