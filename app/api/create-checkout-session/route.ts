import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartData, shippingData } = body;

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingData) {
      return NextResponse.json(
        { error: 'Shipping information is required' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = cartData.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.imageUrls || [],
        },
        unit_amount: Math.round(item.product.basePrice * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    // Get user ID from the session
    let userId = null;
    try {
      const userResponse = await fetch(`${request.headers.get('origin')}/api/userinfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        credentials: 'include',
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.authenticated && userData.id) {
          userId = userData.id;
          console.log('Found user ID for checkout session:', userId);
        }
      }
    } catch (error) {
      console.error('Error getting user info for checkout session:', error);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout`,
      metadata: {
        // Store shipping information in metadata
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        province: shippingData.province,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        note: shippingData.note || '',
        totalAmount: cartData.totalPrice.toString(),
        itemCount: cartData.items.length.toString(),
        // Add user ID to metadata for webhook processing
        ...(userId && { userId: userId.toString() }),
      },
      customer_email: shippingData.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'LK'], // Add Sri Lanka
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 