import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('GetUserOrders API: Starting request to Java backend');
    
    // Get cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    console.log('GetUserOrders API: Cookie header:', cookie);
    
    // Forward the request to the Java servlet
    const response = await fetch('http://localhost:8080/kaidenz/GetOdersForUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie, // forward session cookie
      },
    });

    console.log('GetUserOrders API: Java backend response status:', response.status);

    const data = await response.json();
    console.log('GetUserOrders API: Received data from Java backend:', data);

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('GetUserOrders API: Error calling Java backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to backend' 
      },
      { status: 500 }
    );
  }
} 