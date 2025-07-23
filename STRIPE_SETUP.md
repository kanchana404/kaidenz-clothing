# Stripe Payment Integration Setup

This guide will help you set up Stripe payment processing for the checkout functionality.

## 1. Stripe Account Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

## 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 3. Webhook Configuration

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add a new endpoint with URL: `https://your-domain.com/api/webhooks/stripe`
4. Select the following events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## 4. Testing

### Test Cards
Use these test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Mode
- All transactions in test mode are free
- No real charges will be made
- Perfect for development and testing

## 5. Production Setup

When ready for production:

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Test with small amounts first

## 6. Features Implemented

- ✅ Stripe Checkout Session creation
- ✅ Cart data integration
- ✅ Shipping information collection
- ✅ Success page after payment
- ✅ Webhook handling for payment confirmation
- ✅ Error handling and validation

## 7. Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Store sensitive data securely

## 8. Customization

You can customize the checkout experience by modifying:

- `app/api/create-checkout-session/route.ts` - Checkout session configuration
- `app/checkout/success/page.tsx` - Success page design
- `app/api/webhooks/stripe/route.ts` - Payment processing logic

## 9. Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com) 