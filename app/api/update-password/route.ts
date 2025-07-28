import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('UpdatePassword API: Starting request to Java backend');
    
    // Get cookies from the incoming request
    const cookie = request.headers.get('cookie') || '';
    console.log('UpdatePassword API: Cookie header:', cookie);
    
    // Get request body
    const body = await request.json();
    console.log('UpdatePassword API: Request body:', body);
    
    // Forward the request to the Java servlet
    const response = await fetch('http://localhost:8080/kaidenz/UpdateUserPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie, // forward session cookie
      },
      body: JSON.stringify(body),
    });

    console.log('UpdatePassword API: Java backend response status:', response.status);

    const data = await response.json();
    console.log('UpdatePassword API: Received data from Java backend:', data);

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('UpdatePassword API: Error calling Java backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to backend' 
      },
      { status: 500 }
    );
  }
} 