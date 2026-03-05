import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { prisma } from '@saas/db';

@Controller('health')
export class HealthController {
  @Get()
  async getHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: 'up' };
    } catch {
      throw new ServiceUnavailableException({
        status: 'degraded',
        db: 'down',
        message: 'Database unavailable. Start Postgres and run migrations.'
      });
    }
  }
}
