import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SessionAuthGuard } from './auth/session-auth.guard';
import { CandidatesController } from './candidates/candidates.controller';
import { CandidatesService } from './candidates/candidates.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { HealthController } from './health/health.controller';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { StripeController } from './stripe/stripe.controller';

@Module({
  imports: [],
  controllers: [
    HealthController,
    AuthController,
    DashboardController,
    CandidatesController,
    ProjectsController,
    SkillsController,
    StripeController
  ],
  providers: [
    AuthService,
    SessionAuthGuard,
    DashboardService,
    CandidatesService,
    ProjectsService,
    SkillsService
  ]
})
export class AppModule {}
