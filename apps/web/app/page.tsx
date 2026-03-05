import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const hasAuthCookie = Boolean((await cookies()).get('chromedia_access')?.value);
  if (hasAuthCookie) {
    redirect('/admin/dashboard');
  }

  redirect('/login');
}
