// app/api/delete-cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { cartItemId } = await request.json();
    const cookie = request.headers.get('cookie') || '';

    console.log('Deleting cart item via POST:', cartItemId);
    console.log('Calling servlet URL: http://localhost:8080/kaidenz/DeleteCart');
    console.log('Request body:', JSON.stringify({ cartItemId }));
    console.log('Cookies being sent:', cookie);
    
    const response = await fetch('http://localhost:8080/kaidenz/DeleteCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ cartItemId }),
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
    console.error('Error in Next POST→DeleteCart:', error);
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
