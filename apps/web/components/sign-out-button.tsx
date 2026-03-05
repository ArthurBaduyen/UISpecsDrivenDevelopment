'use client';

import { Button } from '@repo/ui/primitives/button';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    router.push('/login');
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut}>
      Logout
    </Button>
  );
}
