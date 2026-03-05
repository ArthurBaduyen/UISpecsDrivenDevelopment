'use client';

import { Button } from '@repo/ui/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@repo/ui/primitives/card';
import { Input } from '@repo/ui/primitives/input';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getSession } from '../../lib/chromedia-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function toHumanError(error: unknown): string {
  if (error instanceof TypeError) {
    return `Cannot reach API at ${API_URL}. Start the backend server and try again.`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Login failed';
}

export default function LoginPage() {
  const router = useRouter();
  const [from, setFrom] = useState('/admin/dashboard');

  const [email, setEmail] = useState('admin@chromedia.test');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setFrom(searchParams.get('from') ?? '/admin/dashboard');
  }, []);

  useEffect(() => {
    void (async () => {
      const session = await getSession().catch(() => ({ authenticated: false }));
      if (session.authenticated) {
        router.replace('/admin/dashboard');
      }
    })();
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = (await response
          .json()
          .catch(() => ({ message: 'Invalid credentials' }))) as {
          message?: string;
        };
        throw new Error(payload.message ?? 'Invalid credentials');
      }

      router.push(from);
      router.refresh();
    } catch (submitError) {
      setError(toHumanError(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Use a super admin or admin demo account below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 rounded-md bg-slate-100 p-3 text-xs text-slate-600">
            Demo accounts:
            <br />
            superadmin@chromedia.test / demo1234
            <br />
            admin@chromedia.test / demo1234
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
