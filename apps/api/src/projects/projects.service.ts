import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@saas/db';
import { CreateProjectInput, UpdateProjectInput } from '@saas/validation';

@Injectable()
export class ProjectsService {
  async list(organizationId?: string) {
    return prisma.project.findMany({
      where: organizationId ? { organizationId } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(input: CreateProjectInput) {
    return prisma.project.create({ data: input });
  }

  async getById(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return project;
  }

  async update(id: string, input: UpdateProjectInput) {
    await this.getById(id);

    return prisma.project.update({
      where: { id },
      data: {
        ...input,
        description: input.description === undefined ? undefined : input.description
      }
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await prisma.project.delete({ where: { id } });
  }
}
