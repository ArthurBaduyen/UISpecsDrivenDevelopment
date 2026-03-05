import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { StripeController } from './stripe/stripe.controller';

@Module({
  imports: [],
  controllers: [HealthController, ProjectsController, StripeController],
  providers: [ProjectsService]
})
export class AppModule {}
