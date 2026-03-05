import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CandidateQueryInput,
  CreateCandidateInput,
  CreateCandidateInviteLinkInput,
  UpdateCandidateInput
} from '@saas/validation';
import { prisma } from '@saas/db';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CandidatesService {
  async query(input: CandidateQueryInput) {
    const where = {
      ...(input.q
        ? {
            OR: [
              { name: { contains: input.q, mode: 'insensitive' as const } },
              { role: { contains: input.q, mode: 'insensitive' as const } },
              { technologies: { contains: input.q, mode: 'insensitive' as const } }
            ]
          }
        : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.role ? { role: { contains: input.role, mode: 'insensitive' as const } } : {})
    };

    const total = await prisma.candidate.count({ where });
    const items = await prisma.candidate.findMany({
      where,
      orderBy: { [input.sortBy]: input.sortDir },
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize
    });

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.max(1, Math.ceil(total / input.pageSize))
    };
  }

  async listAll() {
    return prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    return candidate;
  }

  async create(input: CreateCandidateInput) {
    return prisma.candidate.create({
      data: {
        name: input.name,
        role: input.role,
        technologies: input.technologies,
        expectedSalary: input.expectedSalary,
        available: input.available,
        status: input.status,
        email: input.email,
        phone: input.phone
      }
    });
  }

  async update(id: string, input: UpdateCandidateInput) {
    await this.getById(id);
    return prisma.candidate.update({ where: { id }, data: input });
  }

  async remove(id: string) {
    await this.getById(id);
    await prisma.candidate.delete({ where: { id } });
  }

  async createInviteLink(input: CreateCandidateInviteLinkInput) {
    await this.getById(input.candidateId);

    const token = randomUUID();
    const expiresAt = input.expirationDate
      ? new Date(input.expirationDate)
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

    const invite = await prisma.candidateInviteLink.create({
      data: {
        candidateId: input.candidateId,
        tokenHash: token,
        expiresAt
      }
    });

    return {
      id: invite.id,
      token,
      expiresAt: invite.expiresAt
    };
  }
}
