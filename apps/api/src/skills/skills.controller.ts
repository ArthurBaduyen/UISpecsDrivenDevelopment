import { BadRequestException, Body, Controller, Get, Inject, Put, Query, UseGuards } from '@nestjs/common';
import { putSkillsTaxonomySchema, skillsQuerySchema } from '@saas/validation';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { SkillsService } from './skills.service';

@Controller('skills')
@UseGuards(SessionAuthGuard)
export class SkillsController {
  constructor(@Inject(SkillsService) private readonly skillsService: SkillsService) {}

  @Get()
  async getSkills() {
    return this.skillsService.getTaxonomy();
  }

  @Get('query')
  async querySkills(@Query() query: unknown) {
    const parsed = skillsQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.skillsService.query(parsed.data);
  }

  @Put()
  async replaceSkills(@Body() body: unknown) {
    const parsed = putSkillsTaxonomySchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.skillsService.replaceTaxonomy(parsed.data);
  }
}
