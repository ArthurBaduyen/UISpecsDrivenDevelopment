import { CandidateStatus, Role, UserRole, prisma } from '../src';

async function main() {
  const org = await prisma.organization.upsert({
    where: { stripeCustomerId: 'seed_customer_001' },
    update: {},
    create: {
      name: 'Acme Inc',
      stripeCustomerId: 'seed_customer_001',
      subscriptionStatus: 'active'
    }
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@chromedia.test' },
    update: {},
    create: {
      email: 'superadmin@chromedia.test',
      username: 'superadmin',
      name: 'Super Admin',
      role: UserRole.SUPER_ADMIN,
      passwordHash: 'demo1234'
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@chromedia.test' },
    update: {},
    create: {
      email: 'admin@chromedia.test',
      username: 'admin',
      name: 'Admin User',
      role: UserRole.ADMIN,
      passwordHash: 'demo1234'
    }
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: superAdmin.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      userId: superAdmin.id,
      organizationId: org.id,
      role: Role.OWNER
    }
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: admin.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      userId: admin.id,
      organizationId: org.id,
      role: Role.ADMIN
    }
  });

  const seedCandidates = [
    {
      name: 'Jane Santos',
      role: 'Frontend Developer',
      technologies: 'React, TypeScript',
      expectedSalary: '$4,000/mo',
      available: '2 weeks',
      status: CandidateStatus.Active,
      email: 'jane.santos@example.com',
      phone: '+639171234567'
    },
    {
      name: 'Mark Dela Cruz',
      role: 'QA Engineer',
      technologies: 'Playwright, Cypress',
      expectedSalary: '$3,200/mo',
      available: 'Immediate',
      status: CandidateStatus.Pending,
      email: 'mark.delacruz@example.com'
    },
    {
      name: 'Rina Gomez',
      role: 'Backend Developer',
      technologies: 'Node.js, PostgreSQL',
      expectedSalary: '$4,500/mo',
      available: '1 month',
      status: CandidateStatus.Inactive,
      email: 'rina.gomez@example.com'
    }
  ];

  for (const candidate of seedCandidates) {
    const existing = await prisma.candidate.findFirst({
      where: { email: candidate.email }
    });

    if (existing) {
      await prisma.candidate.update({
        where: { id: existing.id },
        data: candidate
      });
    } else {
      await prisma.candidate.create({ data: candidate });
    }
  }

  const candidateA = await prisma.candidate.findFirstOrThrow({
    where: { email: 'jane.santos@example.com' }
  });

  const existingInvite = await prisma.candidateInviteLink.findUnique({
    where: { tokenHash: 'seed_invite_token_jane' }
  });

  if (existingInvite) {
    await prisma.candidateInviteLink.update({
      where: { id: existingInvite.id },
      data: {
        candidateId: candidateA.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        revokedAt: null
      }
    });
  } else {
    await prisma.candidateInviteLink.create({
      data: {
        candidateId: candidateA.id,
        tokenHash: 'seed_invite_token_jane',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
      }
    });
  }

  const seedProjects = [
    {
      organizationId: org.id,
      name: 'Launch dashboard',
      description: 'Build initial dashboard widgets'
    },
    {
      organizationId: org.id,
      name: 'Setup billing',
      description: 'Wire Stripe webhook processing'
    }
  ];

  for (const project of seedProjects) {
    const existing = await prisma.project.findFirst({
      where: { organizationId: org.id, name: project.name }
    });

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: { description: project.description }
      });
    } else {
      await prisma.project.create({ data: project });
    }
  }

  const seedTaxonomy = [
    {
      name: 'Frontend',
      slug: 'frontend',
      description: 'Client-side web development skills',
      displayOrder: 1,
      skills: [
        {
          name: 'React',
          code: 'react',
          description: 'React ecosystem and component architecture',
          displayOrder: 1,
          capabilities: {
            'Entry Level': ['Build basic components', 'Use props and state'],
            'Mid Level': ['Design reusable UI modules', 'Manage async data flows'],
            'Senior Level': ['Lead architecture decisions', 'Optimize performance'],
            'Senior Lead Level': ['Define frontend standards', 'Mentor engineering teams']
          }
        },
        {
          name: 'TypeScript',
          code: 'typescript',
          description: 'Type-safe JavaScript development',
          displayOrder: 2,
          capabilities: {
            'Entry Level': ['Use basic types', 'Annotate function signatures'],
            'Mid Level': ['Model domain types', 'Use generics effectively'],
            'Senior Level': ['Design shared type systems', 'Improve API contract safety'],
            'Senior Lead Level': ['Establish monorepo typing conventions', 'Drive typing strategy']
          }
        }
      ]
    },
    {
      name: 'Backend',
      slug: 'backend',
      description: 'Server-side and data platform skills',
      displayOrder: 2,
      skills: [
        {
          name: 'Node.js',
          code: 'nodejs',
          description: 'Backend services using Node.js',
          displayOrder: 1,
          capabilities: {
            'Entry Level': ['Create REST endpoints', 'Handle basic validation'],
            'Mid Level': ['Structure services/modules', 'Implement robust error handling'],
            'Senior Level': ['Design scalable backend systems', 'Tune service performance'],
            'Senior Lead Level': ['Define platform architecture', 'Govern backend standards']
          }
        }
      ]
    }
  ];

  for (const categoryInput of seedTaxonomy) {
    const category = await prisma.skillCategory.upsert({
      where: { name: categoryInput.name },
      update: {
        slug: categoryInput.slug,
        description: categoryInput.description,
        displayOrder: categoryInput.displayOrder
      },
      create: {
        name: categoryInput.name,
        slug: categoryInput.slug,
        description: categoryInput.description,
        displayOrder: categoryInput.displayOrder
      }
    });

    for (const skillInput of categoryInput.skills) {
      const existingSkill = await prisma.skill.findFirst({
        where: { categoryId: category.id, name: skillInput.name }
      });

      if (existingSkill) {
        await prisma.skill.update({
          where: { id: existingSkill.id },
          data: {
            code: skillInput.code,
            description: skillInput.description,
            capabilities: skillInput.capabilities,
            displayOrder: skillInput.displayOrder
          }
        });
      } else {
        await prisma.skill.create({
          data: {
            categoryId: category.id,
            name: skillInput.name,
            code: skillInput.code,
            description: skillInput.description,
            capabilities: skillInput.capabilities,
            displayOrder: skillInput.displayOrder
          }
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
