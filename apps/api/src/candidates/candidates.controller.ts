import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  candidateIdParamSchema,
  candidateQuerySchema,
  createCandidateInviteLinkSchema,
  createCandidateSchema,
  updateCandidateSchema
} from '@saas/validation';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { CandidatesService } from './candidates.service';

@Controller()
@UseGuards(SessionAuthGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('candidates')
  async listCandidates() {
    return this.candidatesService.listAll();
  }

  @Get('candidates/query')
  async queryCandidates(@Query() query: unknown) {
    const parsed = candidateQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.candidatesService.query(parsed.data);
  }

  @Get('candidates/:id')
  async getCandidate(@Param() params: unknown) {
    const parsed = candidateIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.candidatesService.getById(parsed.data.id);
  }

  @Post('candidates')
  async createCandidate(@Body() body: unknown) {
    const parsed = createCandidateSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.candidatesService.create(parsed.data);
  }

  @Put('candidates/:id')
  async updateCandidate(@Param() params: unknown, @Body() body: unknown) {
    const parsedParams = candidateIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException(parsedParams.error.flatten());
    }

    const parsedBody = updateCandidateSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException(parsedBody.error.flatten());
    }

    return this.candidatesService.update(parsedParams.data.id, parsedBody.data);
  }

  @Delete('candidates/:id')
  @HttpCode(204)
  async deleteCandidate(@Param() params: unknown) {
    const parsed = candidateIdParamSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    await this.candidatesService.remove(parsed.data.id);
  }

  @Post('candidate-links')
  async createCandidateLink(@Body() body: unknown) {
    const parsed = createCandidateInviteLinkSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.candidatesService.createInviteLink(parsed.data);
  }
}
