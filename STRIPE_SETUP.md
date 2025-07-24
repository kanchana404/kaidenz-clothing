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

# Email Service Configuration (Choose one)
# Option 1: Resend (Recommended for Next.js)
RESEND_API_KEY=re_your_resend_api_key_here

# Option 2: SendGrid
SENDGRID_API_KEY=SG_your_sendgrid_api_key_here

# Option 3: AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Option 4: SMTP (for Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
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

## 4. Email Service Setup

### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add your domain for sending emails
4. Install: `npm install resend`
5. Uncomment the Resend implementation in `app/api/send-email/route.ts`

### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key from the dashboard
3. Verify your sender domain
4. Install: `npm install @sendgrid/mail`
5. Uncomment the SendGrid implementation in `app/api/send-email/route.ts`

### Option 3: AWS SES
1. Set up AWS SES in your AWS account
2. Verify your email domain
3. Install: `npm install @aws-sdk/client-ses`
4. Uncomment the AWS SES implementation in `app/api/send-email/route.ts`

### Option 4: SMTP (Gmail, etc.)
1. Configure your SMTP settings
2. Install: `npm install nodemailer`
3. Uncomment the Nodemailer implementation in `app/api/send-email/route.ts`

## 5. Testing

### Test Cards
Use these test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Mode
- All transactions in test mode are free
- No real charges will be made
- Perfect for development and testing

### Email Testing
- Check your console logs to see email content
- Implement an email service to send real emails
- Test with your own email address first

## 6. Production Setup

When ready for production:

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Configure a production email service
5. Test with small amounts first

## 7. Features Implemented

- ✅ Stripe Checkout Session creation
- ✅ Cart data integration
- ✅ Shipping information collection
- ✅ Success page after payment
- ✅ Webhook handling for payment confirmation
- ✅ **Email confirmation after successful payment**
- ✅ Error handling and validation

## 8. Email Features

### Automatic Email Sending
- Emails are automatically sent when payment is successful
- Includes order details, shipping information, and total amount
- Beautiful HTML email template with responsive design
- Plain text fallback for email clients that don't support HTML

### Email Content
- Order confirmation with order ID
- List of purchased items with quantities and prices
- Shipping address and contact information
- Total payment amount
- Professional branding and styling

### Customization
You can customize the email template by modifying:
- `app/api/webhooks/stripe/route.ts` - Email generation logic
- `generateEmailContent()` function - Email HTML and text content
- `app/api/send-email/route.ts` - Email service configuration

## 9. Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Store sensitive data securely
- Use environment variables for all API keys

## 10. Customization

You can customize the checkout experience by modifying:

- `app/api/create-checkout-session/route.ts` - Checkout session configuration
- `app/checkout/success/page.tsx` - Success page design
- `app/api/webhooks/stripe/route.ts` - Payment processing logic and email content
- `app/api/send-email/route.ts` - Email service configuration

## 11. Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For email service issues:
- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://sendgrid.com/docs)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/) 