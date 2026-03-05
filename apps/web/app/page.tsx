import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold tracking-tight">SaaS Starter</h1>
      <p className="text-slate-700">
        Next.js + NestJS + Prisma monorepo scaffold with multi-tenant foundations.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
