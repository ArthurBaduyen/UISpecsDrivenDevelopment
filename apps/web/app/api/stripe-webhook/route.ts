import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    received: true,
    message: 'Stripe webhook web placeholder route. Verification pending.',
    eventType: (body as { type?: string }).type ?? null
  });
}
