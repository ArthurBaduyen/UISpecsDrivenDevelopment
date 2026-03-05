import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, prisma } from '@saas/db';
import {
  CreateSharedProfileInput,
  SharedProfilesQueryInput,
  UpdateSharedProfileInput
} from '@saas/validation';
import { randomUUID } from 'node:crypto';

type SharedProfileStatus = 'Active' | 'Expired' | 'Revoked';

function getStatus(sharedProfile: { revokedAt: Date | null; expirationDate: Date }): SharedProfileStatus {
  if (sharedProfile.revokedAt) {
    return 'Revoked';
  }
  if (sharedProfile.expirationDate < new Date()) {
    return 'Expired';
  }
  return 'Active';
}

function mapSharedProfile(sharedProfile: {
  id: string;
  shareToken: string;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  sharedWithName: string;
  sharedWithEmail: string;
  rateLabel: string;
  expirationDate: Date;
  sharedAt: Date;
  revokedAt: Date | null;
  accessCount: number;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sharedByUserId: string | null;
}) {
  return {
    ...sharedProfile,
    status: getStatus(sharedProfile)
  };
}

@Injectable()
export class SharedProfilesService {
  private readonly db = prisma as unknown as PrismaClient;

  async listAll() {
    const rows = await this.db.sharedProfile.findMany({
      orderBy: { sharedAt: 'desc' }
    });
    return rows.map(mapSharedProfile);
  }

  async query(input: SharedProfilesQueryInput) {
    const statusWhere =
      input.status === 'Active'
        ? {
            revokedAt: null,
            expirationDate: { gte: new Date() }
          }
        : input.status === 'Expired'
          ? {
              revokedAt: null,
              expirationDate: { lt: new Date() }
            }
          : input.status === 'Revoked'
            ? {
                revokedAt: { not: null } as Prisma.DateTimeNullableFilter
              }
            : {};

    const where = {
      ...statusWhere,
      ...(input.q
        ? {
            OR: [
              { candidateName: { contains: input.q, mode: 'insensitive' as const } },
              { candidateRole: { contains: input.q, mode: 'insensitive' as const } },
              { sharedWithName: { contains: input.q, mode: 'insensitive' as const } },
              { sharedWithEmail: { contains: input.q, mode: 'insensitive' as const } }
            ]
          }
        : {})
    };

    const total = await this.db.sharedProfile.count({ where });
    const items = await this.db.sharedProfile.findMany({
      where,
      orderBy: {
        [input.sortBy]: input.sortDir
      },
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize
    });

    return {
      items: items.map(mapSharedProfile),
      total,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.max(1, Math.ceil(total / input.pageSize))
    };
  }

  async create(input: CreateSharedProfileInput, sharedByUserId?: string) {
    const candidate = await this.db.candidate.findUnique({
      where: { id: input.candidateId }
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    const created = await this.db.sharedProfile.create({
      data: {
        shareToken: randomUUID(),
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateRole: candidate.role,
        sharedWithName: input.sharedWithName,
        sharedWithEmail: input.sharedWithEmail,
        rateLabel: input.rateLabel,
        expirationDate: new Date(input.expirationDate),
        sharedByUserId: sharedByUserId ?? null
      }
    });

    return mapSharedProfile(created);
  }

  async update(id: string, input: UpdateSharedProfileInput) {
    await this.getById(id);
    const updated = await this.db.sharedProfile.update({
      where: { id },
      data: {
        rateLabel: input.rateLabel ?? undefined,
        expirationDate: input.expirationDate ? new Date(input.expirationDate) : undefined
      }
    });

    return mapSharedProfile(updated);
  }

  async revoke(id: string) {
    await this.getById(id);
    const updated = await this.db.sharedProfile.update({
      where: { id },
      data: { revokedAt: new Date() }
    });
    return mapSharedProfile(updated);
  }

  async getPublicShare(token: string) {
    const sharedProfile = await this.db.sharedProfile.findUnique({
      where: { shareToken: token }
    });

    if (!sharedProfile) {
      throw new NotFoundException('Shared profile not found');
    }

    if (sharedProfile.revokedAt || sharedProfile.expirationDate < new Date()) {
      throw new NotFoundException('Shared profile link is unavailable');
    }

    return mapSharedProfile(sharedProfile);
  }

  async getPublicCandidate(token: string) {
    const sharedProfile = await this.getPublicShare(token);
    const candidate = await this.db.candidate.findUnique({
      where: { id: sharedProfile.candidateId }
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    await this.db.sharedProfile.update({
      where: { id: sharedProfile.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date()
      }
    });

    return candidate;
  }

  private async getById(id: string) {
    const sharedProfile = await this.db.sharedProfile.findUnique({ where: { id } });
    if (!sharedProfile) {
      throw new NotFoundException('Shared profile not found');
    }
    return sharedProfile;
  }
}
