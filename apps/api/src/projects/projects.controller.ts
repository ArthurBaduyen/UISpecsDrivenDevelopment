import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { createProjectSchema, projectIdParamSchema, updateProjectSchema } from '@saas/validation';
import { z } from 'zod';
import { ProjectsService } from './projects.service';

const projectsQuerySchema = z.object({
  organizationId: z.string().min(1).optional()
});

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async listProjects(@Query() query: unknown) {
    const parsed = projectsQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.projectsService.list(parsed.data.organizationId);
  }

  @Post()
  async createProject(@Body() body: unknown) {
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.projectsService.create(parsed.data);
  }

  @Get(':id')
  async getProject(@Param() params: unknown) {
    const parsed = projectIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.projectsService.getById(parsed.data.id);
  }

  @Patch(':id')
  async updateProject(@Param() params: unknown, @Body() body: unknown) {
    const parsedParams = projectIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException(parsedParams.error.flatten());
    }

    const parsedBody = updateProjectSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.flatten());
    }

    return this.projectsService.update(parsedParams.data.id, parsedBody.data);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProject(@Param() params: unknown) {
    const parsed = projectIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    await this.projectsService.remove(parsed.data.id);
  }
}
