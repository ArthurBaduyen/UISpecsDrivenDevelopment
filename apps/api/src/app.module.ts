import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SessionAuthGuard } from './auth/session-auth.guard';
import { CandidatesController } from './candidates/candidates.controller';
import { CandidatesService } from './candidates/candidates.service';
import { HealthController } from './health/health.controller';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { StripeController } from './stripe/stripe.controller';

@Module({
  imports: [],
  controllers: [
    HealthController,
    AuthController,
    CandidatesController,
    ProjectsController,
    StripeController
  ],
  providers: [AuthService, SessionAuthGuard, CandidatesService, ProjectsService]
})
export class AppModule {}
