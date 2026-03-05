import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  @Post('webhook')
  @HttpCode(200)
  handleWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('stripe-signature') signature?: string
  ) {
    return {
      received: true,
      message: 'Stripe webhook scaffold. Signature verification pending.',
      signaturePresent: Boolean(signature),
      eventType: payload?.type ?? null
    };
  }
}
