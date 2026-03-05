import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Prisma, PrismaClient, prisma } from '@saas/db';
import { PutSkillsTaxonomyInput, SkillsQueryInput } from '@saas/validation';

type CapabilityLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Senior Lead Level';
const capabilityLevels: CapabilityLevel[] = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Senior Lead Level'
];

function throwSkillsDbError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021' || error.code === 'P2022') {
      throw new ServiceUnavailableException(
        'Skills tables are missing. Run pnpm db:migrate and pnpm db:seed.'
      );
    }
  }
  throw error instanceof Error
    ? new ServiceUnavailableException(error.message)
    : new ServiceUnavailableException('Skills service unavailable');
}

function normalizeCapabilities(value: unknown) {
  const input = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const output: Record<CapabilityLevel, string[]> = {
    'Entry Level': [],
    'Mid Level': [],
    'Senior Level': [],
    'Senior Lead Level': []
  };

  for (const level of capabilityLevels) {
    const entries = input[level];
    output[level] = Array.isArray(entries)
      ? [...new Set(entries.map((item) => String(item).trim()).filter(Boolean))]
      : [];
  }

  return output;
}

@Injectable()
export class SkillsService {
  async getTaxonomy() {
    try {
      const db = prisma as unknown as PrismaClient;
      const categories = await db.skillCategory.findMany({
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        include: {
          skills: {
            orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }]
          }
        }
      });

        return {
          taxonomyVersion: 'v1',
          updatedAt: new Date().toISOString(),
          categories: categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            displayOrder: category.displayOrder,
            skills: category.skills.map((skill) => ({
              id: skill.id,
              name: skill.name,
              code: skill.code,
            description: skill.description,
            capabilities: normalizeCapabilities(skill.capabilities),
            displayOrder: skill.displayOrder
          }))
        }))
      };
    } catch (error) {
      throwSkillsDbError(error);
    }
  }

  async query(input: SkillsQueryInput) {
    try {
      const db = prisma as unknown as PrismaClient;
      if (input.scope === 'categories') {
        const where = input.q
          ? { name: { contains: input.q, mode: 'insensitive' as const } }
          : undefined;

        const total = await db.skillCategory.count({ where });
        const categories = await db.skillCategory.findMany({
          where,
          orderBy: {
            [input.sortBy === 'updatedAt' ? 'updatedAt' : 'name']: input.sortDir
          },
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          include: { _count: { select: { skills: true } } }
        });

        return {
          items: categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            skillsCount: category._count.skills,
            updatedAt: category.updatedAt
          })),
          total,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.max(1, Math.ceil(total / input.pageSize))
        };
      }

      const where = {
        categoryId: input.categoryId,
        ...(input.q
          ? {
              OR: [
                { name: { contains: input.q, mode: 'insensitive' as const } },
                { description: { contains: input.q, mode: 'insensitive' as const } }
              ]
            }
          : {})
      };

      const total = await db.skill.count({ where });
      const skills = await db.skill.findMany({
        where,
        orderBy: {
          [input.sortBy === 'updatedAt' ? 'updatedAt' : 'name']: input.sortDir
        },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize
      });

      return {
        items: skills.map((skill) => {
          const capabilities = normalizeCapabilities(skill.capabilities);
          const capabilityCount = capabilityLevels.reduce(
            (sum, level) => sum + capabilities[level].length,
            0
          );
          return {
            id: skill.id,
            categoryId: skill.categoryId,
            name: skill.name,
            description: skill.description,
            capabilityCount,
            updatedAt: skill.updatedAt
          };
        }),
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(total / input.pageSize))
      };
    } catch (error) {
      throwSkillsDbError(error);
    }
  }

  async replaceTaxonomy(input: PutSkillsTaxonomyInput) {
    try {
      await prisma.$transaction(async (tx) => {
        const dbTx = tx as Prisma.TransactionClient;
        const existingCategories = await dbTx.skillCategory.findMany({
          include: { skills: true }
        });
        const existingCategoryIds = new Set(existingCategories.map((category) => category.id));
        const keptCategoryIds = new Set<string>();

      for (const category of input.categories) {
        const nextCategory = category.id && existingCategoryIds.has(category.id)
          ? await dbTx.skillCategory.update({
              where: { id: category.id },
              data: {
                name: category.name,
                slug: category.slug ?? null,
                description: category.description ?? null,
                displayOrder: category.displayOrder
              }
            })
          : await dbTx.skillCategory.create({
              data: {
                name: category.name,
                slug: category.slug ?? null,
                description: category.description ?? null,
                displayOrder: category.displayOrder
              }
            });

        keptCategoryIds.add(nextCategory.id);

          const existingSkills =
            existingCategories.find((item) => item.id === nextCategory.id)?.skills ?? [];
          const existingSkillIds = new Set(existingSkills.map((skill) => skill.id));
          const keptSkillIds = new Set<string>();

        for (const skill of category.skills) {
          const nextCapabilities = normalizeCapabilities(skill.capabilities);
          const nextSkill = skill.id && existingSkillIds.has(skill.id)
            ? await dbTx.skill.update({
                where: { id: skill.id },
                data: {
                  name: skill.name,
                  code: skill.code ?? null,
                  description: skill.description ?? null,
                  capabilities: nextCapabilities,
                  displayOrder: skill.displayOrder
                }
              })
            : await dbTx.skill.create({
                data: {
                  categoryId: nextCategory.id,
                  name: skill.name,
                  code: skill.code ?? null,
                  description: skill.description ?? null,
                  capabilities: nextCapabilities,
                  displayOrder: skill.displayOrder
                }
              });
          keptSkillIds.add(nextSkill.id);
        }

        await dbTx.skill.deleteMany({
          where: {
            categoryId: nextCategory.id,
            id: { notIn: [...keptSkillIds] }
          }
        });
      }

        await dbTx.skillCategory.deleteMany({
          where: { id: { notIn: [...keptCategoryIds] } }
        });
      });
      return this.getTaxonomy();
    } catch (error) {
      throwSkillsDbError(error);
    }
  }
}
