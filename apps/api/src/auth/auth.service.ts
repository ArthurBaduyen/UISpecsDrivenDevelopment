import {
  HttpException,
  InternalServerErrorException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { Prisma, UserRole, prisma } from '@saas/db';
import type { Response } from 'express';
import { randomUUID } from 'node:crypto';

const ACCESS_COOKIE_NAME = 'chromedia_access';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function rethrowDatabaseError(error: unknown): never {
  if (error instanceof Error) {
    console.error('[auth] error:', error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2021' || error.code === 'P2022') {
      throw new ServiceUnavailableException(
        'Database schema is not ready. Run pnpm db:migrate and pnpm db:seed.'
      );
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new ServiceUnavailableException(
      'Database is unavailable. Check DATABASE_URL and Postgres container.'
    );
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new ServiceUnavailableException(
      'Authentication data is inconsistent. Re-run pnpm db:migrate and pnpm db:seed.'
    );
  }

  throw new InternalServerErrorException(
    error instanceof Error ? `Authentication service error: ${error.message}` : 'Authentication service error'
  );
}

@Injectable()
export class AuthService {
  async login(email: string, password: string, response: Response) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !user.isEnabled || user.passwordHash !== password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        throw new UnauthorizedException('This account cannot access admin login');
      }

      const token = randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await prisma.authSession.create({
        data: {
          tokenHash: token,
          userId: user.id,
          role: user.role,
          expiresAt,
          lastSeenAt: new Date()
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      response.cookie(ACCESS_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        expires: expiresAt
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      rethrowDatabaseError(error);
    }
  }

  async getSession(token?: string) {
    if (!token) {
      return { authenticated: false };
    }

    try {
      const session = await prisma.authSession.findUnique({
        where: { tokenHash: token },
        include: { user: true }
      });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        return { authenticated: false };
      }

      await prisma.authSession.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date() }
      });

      return {
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          name: session.user.name,
          role: session.user.role
        }
      };
    } catch (error) {
      console.error('[auth] getSession failed; returning unauthenticated', error);
      return { authenticated: false };
    }
  }

  async logout(token: string | undefined, response: Response) {
    if (token) {
      try {
        await prisma.authSession.updateMany({
          where: { tokenHash: token, revokedAt: null },
          data: { revokedAt: new Date() }
        });
      } catch (error) {
        rethrowDatabaseError(error);
      }
    }

    response.clearCookie(ACCESS_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });

    return { message: 'Logged out' };
  }

  async resolveUserFromToken(token?: string) {
    if (!token) {
      return null;
    }

    try {
      const session = await prisma.authSession.findUnique({
        where: { tokenHash: token },
        include: { user: true }
      });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('[auth] resolveUserFromToken failed', error);
      return null;
    }
  }
}
