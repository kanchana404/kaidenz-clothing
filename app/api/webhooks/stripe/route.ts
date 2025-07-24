// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Function to get database product ID by Stripe product ID
async function getProductDbId(stripeProductId: string): Promise<number> {
  try {
    console.log('Fetching products from database to find correct product ID...');
    
    // Fetch all products from your database
    const response = await fetch('http://localhost:3000/api/get-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch products from database, using fallback ID: 1');
      return 1; // fallback
    }

    const data = await response.json();
    const products = data.products || [];

    console.log('Available products from database:', products);
    console.log('Looking for Stripe product ID:', stripeProductId);

    // For now, just use the first available product
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log('Using first available product:', firstProduct);
      return firstProduct.id;
    }

    console.warn('No products found in database, using fallback ID: 1');
    return 1;
  } catch (error) {
    console.error('Error fetching products:', error);
    console.log('Using fallback product ID: 1');
    return 1; // fallback
  }
}

// Function to get user information by email
async function getUserInfoByEmail(email: string): Promise<any> {
  try {
    console.log('Attempting to get user info for email:', email);
    
    // Call the userinfo API to get user details
    const response = await fetch('http://localhost:3000/api/userinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Userinfo API not available or user not authenticated');
      return null;
    }

    const userData = await response.json();
    
    // Check if user is authenticated and email matches
    if (userData.authenticated && userData.email === email) {
      console.log('Found authenticated user:', userData);
      return userData;
    } else {
      console.log('User not authenticated or email mismatch');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const buf = await request.arrayBuffer();
  const rawBody = Buffer.from(buf);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data
          .object as Stripe.Checkout.Session;
        await handleAsyncPaymentFailed(checkoutSessionAsyncPaymentFailed);
        break;

      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data
          .object as Stripe.Checkout.Session;
        await handleAsyncPaymentSucceeded(checkoutSessionAsyncPaymentSucceeded);
        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data
          .object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(checkoutSessionCompleted);
        break;

      case "checkout.session.expired":
        const checkoutSessionExpired = event.data
          .object as Stripe.Checkout.Session;
        await handleCheckoutExpired(checkoutSessionExpired);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}

async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  try {
    console.log("Async payment failed:", {
      sessionId: session.id,
      customerId: session.customer,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error handling async payment failed:", error);
  }
}

async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  try {
    console.log("Async payment succeeded:", {
      sessionId: session.id,
      customerId: session.customer,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error handling async payment succeeded:", error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("Checkout completed:", {
      sessionId: session.id,
      customerId: session.customer,
      paymentStatus: session.payment_status,
      amount: session.amount_total,
      metadata: session.metadata,
    });

    // Call the existing API endpoint to get order details
    await getOrderDetailsAndSendToServlet(session.id);
    
    // Clear cart and reduce product quantities after successful payment
    await clearCartAfterPayment(session);
  } catch (error) {
    console.error("Error handling checkout completed:", error);
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  try {
    console.log("Checkout expired:", {
      sessionId: session.id,
      customerId: session.customer,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error handling checkout expired:", error);
  }
}

async function getOrderDetailsAndSendToServlet(sessionId: string) {
  try {
    console.log("Fetching order details from API endpoint for session:", sessionId);
    
    // Call the existing get-session-details API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/get-session-details?session_id=${sessionId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.orderDetails) {
      throw new Error('Invalid response from order details API');
    }

    console.log("Successfully fetched order details from API endpoint");
    
    // Transform the data to match the servlet format with complete information
    const orderData = await transformOrderDataForServlet(data.orderDetails);
    
    // Send to Java servlet
    await sendOrderToServlet(orderData);
    
  } catch (error) {
    console.error("Error fetching order details from API endpoint:", error);
  }
}

async function transformOrderDataForServlet(orderDetails: any) {
  // Transform the order details to match the Java servlet expected format
  // with complete order information including user details
  
  // Try to get user information
  let userInfo = null;
  if (orderDetails.customerEmail) {
    userInfo = await getUserInfoByEmail(orderDetails.customerEmail);
  }
  
  const products = await Promise.all(
    orderDetails.items.map(async (item: any) => {
      const dbProductId = await getProductDbId(item.productId);
      return {
        quantity: item.quantity, // integer
        unitPrice: parseFloat(item.unitPrice.replace('$', '')), // double (convert from string to number)
        dbProductId: dbProductId, // integer - actual database product ID
      };
    })
  );

  return {
    // Order information
    orderId: orderDetails.orderId,
    sessionId: orderDetails.sessionId,
    createdAt: orderDetails.createdAt, // ISO timestamp string
    paymentStatus: orderDetails.paymentStatus, // string
    totalAmount: parseFloat(orderDetails.total.replace('$', '')),
    currency: orderDetails.currency,
    
    // Customer information
    customerEmail: orderDetails.customerEmail,
    
    // User information (if available)
    user: userInfo ? {
      id: userInfo.id,
      userId: userInfo.id, // This matches your User entity's user_id field
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
    } : null,
    
    // Shipping information
    shipping: {
      firstName: orderDetails.shipping.firstName,
      lastName: orderDetails.shipping.lastName,
      email: orderDetails.shipping.email,
      phone: orderDetails.shipping.phone,
      address: orderDetails.shipping.address,
      city: orderDetails.shipping.city,
      province: orderDetails.shipping.province,
      postalCode: orderDetails.shipping.postalCode,
      note: orderDetails.shipping.note,
    },
    
    // Products
    products: products
  };
}

async function sendOrderToServlet(orderData: any) {
  try {
    // Send to Java servlet
    const servletUrl = process.env.JAVA_SERVLET_URL || 'http://localhost:8080/kaidenz/Oders';
    
    console.log("Sending order data to Java servlet:", servletUrl);
    console.log("Order data:", JSON.stringify(orderData, null, 2));
    
    const response = await fetch(servletUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      console.log('Order data sent to Java servlet successfully');
      const responseText = await response.text();
      console.log('Servlet response:', responseText);
    } else {
      console.error('Failed to send order data to Java servlet:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Servlet error response:', errorText);
    }
  } catch (error) {
    console.error('Error sending order to Java servlet:', error);
  }
}

async function clearCartAfterPayment(session: Stripe.Checkout.Session) {
  try {
    console.log("Clearing cart after payment for session:", session.id);
    
    // Get user ID from session metadata or customer email
    let userId = null;
    
    // First try to get user ID from session metadata
    if (session.metadata && session.metadata.userId) {
      userId = parseInt(session.metadata.userId);
      console.log("Found userId in session metadata:", userId);
    }
    
    // If no userId in metadata, try to get from customer email
    if (!userId && session.customer_email) {
      console.log("No userId in metadata, trying to get from email:", session.customer_email);
      const userInfo = await getUserInfoByEmail(session.customer_email);
      if (userInfo && userInfo.id) {
        userId = userInfo.id;
        console.log("Found userId from email lookup:", userId);
      }
    }
    
    // If still no userId, try to get from customer ID
    if (!userId && session.customer) {
      console.log("No userId found, trying customer ID:", session.customer);
      // You might need to implement a method to get user by Stripe customer ID
      // userId = await getUserByStripeCustomerId(session.customer);
    }
    
    if (!userId) {
      console.warn("No user ID found for session, cannot clear cart. Session metadata:", session.metadata);
      console.warn("Customer email:", session.customer_email);
      console.warn("Customer ID:", session.customer);
      return;
    }
    
    // Call the clear cart API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/clear-cart-after-payment`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        sessionId: session.id
      }),
    });

    if (response.ok) {
      console.log('Cart cleared successfully after payment');
      const responseData = await response.json();
      console.log('Clear cart response:', responseData);
    } else {
      console.error('Failed to clear cart after payment:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Clear cart error response:', errorText);
    }
  } catch (error) {
    console.error('Error clearing cart after payment:', error);
  }
}
