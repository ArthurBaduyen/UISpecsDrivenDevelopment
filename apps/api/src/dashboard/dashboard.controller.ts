import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(SessionAuthGuard)
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.summary();
  }
}
