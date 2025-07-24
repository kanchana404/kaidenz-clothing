import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

         // Retrieve the session from Stripe
     const session = await stripe.checkout.sessions.retrieve(sessionId, {
       expand: ['line_items'],
     });

     // Get product details for each line item to access images
     const lineItemsWithProducts = await Promise.all(
       (session.line_items?.data || []).map(async (item: any) => {
         try {
           // Fetch the product details using the product ID
           const product = await stripe.products.retrieve(item.price.product);
           return {
             ...item,
             productDetails: product
           };
         } catch (error) {
           console.error('Error fetching product details:', error);
           return {
             ...item,
             productDetails: null
           };
         }
       })
     );

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

         // Extract line items and metadata
     const lineItems = lineItemsWithProducts;
     const metadata = session.metadata || {};

     // Debug logging
     console.log('Session line items with products:', JSON.stringify(lineItems, null, 2));
     console.log('Session metadata:', JSON.stringify(metadata, null, 2));

    // Format the response
    const orderDetails = {
      sessionId: session.id,
      orderId: `ORD-${Date.now()}`,
      total: `$${(session.amount_total! / 100).toFixed(2)}`,
      currency: session.currency?.toUpperCase(),
      status: session.payment_status,
      customerEmail: session.customer_email,
      shipping: {
        firstName: metadata.firstName || '',
        lastName: metadata.lastName || '',
        email: metadata.email || '',
        phone: metadata.phone || '',
        address: metadata.address || '',
        province: metadata.province || '',
        city: metadata.city || '',
        postalCode: metadata.postalCode || '',
        note: metadata.note || '',
      },
             items: lineItems.map((item: any, index: number) => {
         // Handle image URL - if it's a Stripe image URL, use it directly
         // Otherwise fallback to a default image
         let imageUrl = '/p1.png'; // Default fallback
         
         // Try to get image from fetched product details
         if (item.productDetails?.images && item.productDetails.images.length > 0) {
           const stripeImageUrl = item.productDetails.images[0];
           // Check if it's a valid URL
           if (stripeImageUrl && (stripeImageUrl.startsWith('http') || stripeImageUrl.startsWith('https'))) {
             imageUrl = stripeImageUrl;
           }
         }
         
         // If no Stripe image, try to use a placeholder based on product name
         if (imageUrl === '/p1.png') {
           const productName = item.description?.toLowerCase() || '';
           if (productName.includes('dress') || productName.includes('gown')) {
             imageUrl = '/p2.png'; // Use dress image for dresses
           } else if (productName.includes('jacket') || productName.includes('coat')) {
             imageUrl = '/p1.png';
           } else if (productName.includes('shirt') || productName.includes('t-shirt')) {
             imageUrl = '/p2.png';
           } else if (productName.includes('pants') || productName.includes('jeans')) {
             imageUrl = '/p3.png';
           } else if (productName.includes('shoes') || productName.includes('sneakers')) {
             imageUrl = '/p4.png';
           }
         }
         
         console.log(`Item ${index}:`, {
           name: item.description,
           imageUrl,
           hasStripeImages: !!item.productDetails?.images?.length,
           stripeImages: item.productDetails?.images,
           productDetails: item.productDetails
         });
         
         return {
           name: item.description || 'Product',
           quantity: item.quantity,
           price: `$${(item.amount_total! / 100).toFixed(2)}`,
           unitPrice: `$${(item.price?.unit_amount! / 100).toFixed(2)}`,
           image: imageUrl,
           productId: item.price?.product,
         };
       }),
      estimatedDelivery: 'May 10–13, 2024', // This could be calculated based on shipping options
      paymentStatus: session.payment_status,
      createdAt: new Date(session.created * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      orderDetails,
    });

  } catch (error) {
    console.error('Error retrieving session details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session details' },
      { status: 500 }
    );
  }
} 