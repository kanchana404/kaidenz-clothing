// app/api/clear-cart-after-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json();
    const cookie = request.headers.get('cookie') || '';

    console.log('Clearing cart after payment for user:', userId);
    console.log('Session ID:', sessionId);
    console.log('Calling servlet URL: http://localhost:8080/kaidenz/ClearCart');
    
    const response = await fetch('http://localhost:8080/kaidenz/ClearCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ 
        userId,
        sessionId,
        action: 'clear_cart_after_payment'
      }),
    });

    console.log('Servlet status:', response.status);

    const text = await response.text();
    console.log('Servlet response text:', text);
    
    let data;
    try {
      data = text.trim() ? JSON.parse(text) : { success: false, error: 'Empty response' };
    } catch {
      data = { success: false, error: 'Invalid JSON from server' };
    }

    console.log('Parsed data:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in clear cart after payment:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 