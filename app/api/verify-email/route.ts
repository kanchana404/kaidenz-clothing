import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { user_id, code } = await req.json();
    if (!user_id || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = JSON.stringify({ user_id, code });
    console.log(payload);
    

    const backendRes = await fetch('http://localhost:8080/kaidenz/VerifyAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 