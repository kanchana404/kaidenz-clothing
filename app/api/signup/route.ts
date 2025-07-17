import { NextRequest, NextResponse } from 'next/server';

function generateUserId() {
  // Generate a random 13-digit string
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `user_${randomStr}`;
}

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, password } = await req.json();
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const user_id = generateUserId();
    // Log the payload being sent to the Java backend
    console.log('Forwarding signup data to backend:', { first_name, last_name, email, password, user_id });
    // Forward the request to the Java backend
    const backendRes = await fetch('http://localhost:8080/kaidenz/SignUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, password, user_id })
    });
    const data = await backendRes.json();
    // Log the response from the Java backend
    console.log('Response from backend:', data);
    // Prepare the response
    const response = NextResponse.json({ ...data, user_id }, { status: backendRes.status });
    // Set user_id cookie if signup is successful
    if (data.status) {
      response.cookies.set('user_id', user_id, { httpOnly: false, path: '/' });
    }
    return response;
  } catch (err) {
    console.error('Error in /api/signup:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 