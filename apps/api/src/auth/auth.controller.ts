import { BadRequestException, Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { loginInputSchema } from '@saas/validation';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const parsed = loginInputSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    return this.authService.login(parsed.data.email, parsed.data.password, response);
  }

  @Get('session')
  async session(@Req() request: Request) {
    const token = request.cookies?.chromedia_access as string | undefined;
    return this.authService.getSession(token);
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.chromedia_access as string | undefined;
    return this.authService.logout(token, response);
  }
}
