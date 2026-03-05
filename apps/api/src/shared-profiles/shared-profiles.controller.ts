import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  createSharedProfileSchema,
  sharedProfileIdParamSchema,
  sharedProfilesQuerySchema,
  updateSharedProfileSchema
} from '@saas/validation';
import type { Request } from 'express';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { SharedProfilesService } from './shared-profiles.service';

@Controller()
export class SharedProfilesController {
  constructor(
    @Inject(SharedProfilesService) private readonly sharedProfilesService: SharedProfilesService
  ) {}

  @Get('shared-profiles')
  @UseGuards(SessionAuthGuard)
  async listSharedProfiles() {
    return this.sharedProfilesService.listAll();
  }

  @Get('shared-profiles/query')
  @UseGuards(SessionAuthGuard)
  async querySharedProfiles(@Query() query: unknown) {
    const parsed = sharedProfilesQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.sharedProfilesService.query(parsed.data);
  }

  @Post('shared-profiles')
  @UseGuards(SessionAuthGuard)
  async createSharedProfile(@Body() body: unknown, @Req() request: Request & { user?: { id: string } }) {
    const parsed = createSharedProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.sharedProfilesService.create(parsed.data, request.user?.id);
  }

  @Put('shared-profiles/:id')
  @UseGuards(SessionAuthGuard)
  async updateSharedProfile(@Param() params: unknown, @Body() body: unknown) {
    const parsedParams = sharedProfileIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException(parsedParams.error.flatten());
    }
    const parsedBody = updateSharedProfileSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.flatten());
    }
    return this.sharedProfilesService.update(parsedParams.data.id, parsedBody.data);
  }

  @Post('shared-profiles/:id/revoke')
  @UseGuards(SessionAuthGuard)
  async revokeSharedProfile(@Param() params: unknown) {
    const parsed = sharedProfileIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.sharedProfilesService.revoke(parsed.data.id);
  }

  @Get('public-shares/:token')
  async getPublicShare(@Param('token') token: string) {
    return this.sharedProfilesService.getPublicShare(token);
  }

  @Get('public-shares/:token/candidate')
  async getPublicCandidate(@Param('token') token: string) {
    return this.sharedProfilesService.getPublicCandidate(token);
  }
}
