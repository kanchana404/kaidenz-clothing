import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const jsessionId = cookieStore.get('JSESSIONID');
    const hasUser = !!jsessionId;
    
    return NextResponse.json({ 
      hasUser,
      sessionId: jsessionId?.value || null 
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ hasUser: false, sessionId: null });
  }
} 