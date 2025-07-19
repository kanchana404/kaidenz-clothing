import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  return handleUpdateAddressRequest(request);
}

export async function POST(request: NextRequest) {
  return handleUpdateAddressRequest(request);
}

async function handleUpdateAddressRequest(request: NextRequest) {
  try {
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie');
    console.log("=== UPDATE ADDRESS DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);

    // Get the address data from the request body
    const addressData = await request.json();
    console.log("Address data received:", addressData);

    // Validate required fields - make postal_code optional
    if (!addressData.line1 || !addressData.phone || 
        !addressData.city_name || !addressData.province_name) {
      return NextResponse.json(
        { error: 'Missing required address fields: line1, phone, city_name, and province_name are required' },
        { status: 400 }
      );
    }

    // Forward the request to the Java backend's UpdateAddress endpoint
    console.log("Sending request to backend UpdateAddress with data:", addressData);
    const response = await fetch('http://localhost:8080/kaidenz/UpdateAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: 'include',
      body: JSON.stringify(addressData),
    });

    // Check response headers from backend
    console.log("=== BACKEND RESPONSE HEADERS ===");
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    if (!response.ok) {
      console.error('Backend UpdateAddress API failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return NextResponse.json(
        { error: 'Failed to update address in backend' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('UpdateAddress API response:', result);

    // Create response
    const nextResponse = NextResponse.json(result, { status: response.status });
    
    // Handle any Set-Cookie headers from backend
    const allSetCookies = response.headers.getSetCookie?.() || [];
    
    console.log("=== COOKIE ANALYSIS ===");
    console.log("All set-cookie headers:", allSetCookies);
    
    // Try to get JSESSIONID from all Set-Cookie headers
    let jsessionValue = null;
    if (allSetCookies.length > 0) {
      for (const cookie of allSetCookies) {
        const match = cookie.match(/JSESSIONID=([^;]+)/);
        if (match) {
          jsessionValue = match[1];
          console.log("Found JSESSIONID in Set-Cookie array:", jsessionValue);
          break;
        }
      }
    }

    // Set JSESSIONID cookie if we found it
    if (jsessionValue) {
      console.log("Setting JSESSIONID cookie:", jsessionValue);
      
      // Set the JSESSIONID cookie for the frontend domain
      nextResponse.cookies.set("JSESSIONID", jsessionValue, {
        httpOnly: true,
        path: "/",
        secure: false, // Set to false for HTTP development
        sameSite: "lax", // Use "lax" for HTTP development
        maxAge: 3600
      });
      
      console.log("Set JSESSIONID cookie for frontend domain");
    }

    return nextResponse;
  } catch (error) {
    console.error('Error in update-address API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 