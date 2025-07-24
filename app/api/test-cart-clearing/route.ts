// app/api/test-cart-clearing/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId } = await request.json();
    
    console.log('Testing cart clearing for user:', userId);
    console.log('Session ID:', sessionId);
    
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
        sessionId: sessionId || 'test_session_' + Date.now(),
        action: 'clear_cart_after_payment'
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('Test cart clearing successful:', responseData);
      return NextResponse.json({
        success: true,
        message: 'Test cart clearing completed',
        data: responseData
      });
    } else {
      console.error('Test cart clearing failed:', response.status, responseData);
      return NextResponse.json({
        success: false,
        error: 'Test cart clearing failed',
        details: responseData
      }, { status: response.status });
    }
  } catch (error) {
    console.error('Error in test cart clearing:', error);
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