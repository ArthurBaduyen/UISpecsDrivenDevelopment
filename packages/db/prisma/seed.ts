import { prisma, Role } from '../src';

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

  const user = await prisma.user.upsert({
    where: { email: 'owner@acme.test' },
    update: {},
    create: {
      email: 'owner@acme.test',
      name: 'Acme Owner'
    }
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: org.id,
      role: Role.OWNER
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
