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

  const candidateA = await prisma.candidate.create({
    data: {
      name: 'Jane Santos',
      role: 'Frontend Developer',
      technologies: 'React, TypeScript',
      expectedSalary: '$4,000/mo',
      available: '2 weeks',
      status: CandidateStatus.Active,
      email: 'jane.santos@example.com',
      phone: '+639171234567'
    }
  });

  await prisma.candidate.createMany({
    data: [
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
    ]
  });

  await prisma.candidateInviteLink.create({
    data: {
      candidateId: candidateA.id,
      tokenHash: 'seed_invite_token_jane',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    }
  });

  await prisma.project.createMany({
    data: [
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
    ],
    skipDuplicates: true
  });
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
