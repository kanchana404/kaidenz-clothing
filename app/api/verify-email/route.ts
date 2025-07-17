import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { user_id, code } = await req.json();
    if (!user_id || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Forward cookies from the incoming request (if any)
    const cookieHeader = req.headers.get('cookie');

    const backendRes = await fetch('http://localhost:8080/kaidenz/VerifyAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: 'include', // Important for cross-origin cookies!
      body: JSON.stringify({ user_id, code }),
    });

    const data = await backendRes.json();

    // Forward the Set-Cookie header from backend to browser
    const setCookie = backendRes.headers.get('set-cookie');
    const response = NextResponse.json(data, { status: backendRes.status });
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 