import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Successfully signed out' 
    });
    
    // Clear JSESSIONID cookie
    response.cookies.delete('JSESSIONID');
    
    console.log('Sign out API: JSESSIONID cookie cleared');
    
    return response;
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error during sign out' 
    }, { status: 500 });
  }
} 