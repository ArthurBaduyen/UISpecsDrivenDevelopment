import { z } from 'zod';

const schema = z.object({
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(8).default('dev-secret-unsafe'),
  AUTH_DEMO_EMAIL: z.string().email().default('demo@example.com'),
  AUTH_DEMO_PASSWORD: z.string().min(6).default('demo1234'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:4000')
});

export const parseWebEnv = (source: Record<string, string | undefined>) =>
  schema.parse({
    NEXTAUTH_URL: source.NEXTAUTH_URL,
    NEXTAUTH_SECRET: source.NEXTAUTH_SECRET,
    AUTH_DEMO_EMAIL: source.AUTH_DEMO_EMAIL,
    AUTH_DEMO_PASSWORD: source.AUTH_DEMO_PASSWORD,
    NEXT_PUBLIC_API_URL: source.NEXT_PUBLIC_API_URL
  });

export const env = parseWebEnv(process.env);
