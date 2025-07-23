// app/api/cart/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Grab cookies from the incoming request
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await fetch('http://localhost:8080/kaidenz/GetCart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,               // forward session cookie
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
