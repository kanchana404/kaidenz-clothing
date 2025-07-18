import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleUserInfoRequest(request);
}

export async function POST(request: NextRequest) {
  return handleUserInfoRequest(request);
}

async function handleUserInfoRequest(request: NextRequest) {
  try {
    // Forward cookies from the incoming request (if any)
    const cookieHeader = request.headers.get('cookie');
    console.log("=== USERINFO DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);
    console.log("All request headers:", Object.fromEntries(request.headers.entries()));

    // Forward the request to the Java backend's UserInfo endpoint
    console.log("Sending request to backend UserInfo with cookies:", cookieHeader);
    const response = await fetch('http://localhost:8080/kaidenz/UserInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: 'include',
    });

    // Check all response headers from backend
    console.log("=== BACKEND RESPONSE HEADERS ===");
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    if (!response.ok) {
      console.error('Backend UserInfo API failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch user info from backend' },
        { status: response.status }
      );
    }

    const userData = await response.json();
    console.log('UserInfo API response:', userData);

    // Fetch provinces and cities data
    let provinces = [];
    let cities = [];
    
    try {
      // Fetch provinces
      const provincesResponse = await fetch('http://localhost:8080/kaidenz/GetProvince', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        credentials: 'include',
      });
      
      if (provincesResponse.ok) {
        const provincesData = await provincesResponse.json();
        // Transform provinces array to objects with id and name
        provinces = provincesData.map((province: string, index: number) => ({
          id: (index + 1).toString(),
          name: province
        }));
        console.log('Provinces loaded in userinfo:', provinces);
      } else {
        console.error('Failed to fetch provinces in userinfo:', provincesResponse.status);
      }

      // Fetch cities
      const citiesResponse = await fetch('http://localhost:8080/kaidenz/GetCities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        credentials: 'include',
      });
      
      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json();
        // Transform cities array to objects with id and name
        cities = citiesData.map((city: string, index: number) => ({
          id: (index + 1).toString(),
          name: city
        }));
        console.log('Cities loaded in userinfo:', cities);
      } else {
        console.error('Failed to fetch cities in userinfo:', citiesResponse.status);
      }
    } catch (locationError) {
      console.error('Error fetching location data in userinfo:', locationError);
    }

    // Create response
    const nextResponse = NextResponse.json(userData, { status: response.status });
    
    // Handle any Set-Cookie headers from backend (similar to cart route)
    const setCookieHeader = response.headers.get('set-cookie');
    const allSetCookies = response.headers.getSetCookie?.() || [];
    
    console.log("=== COOKIE ANALYSIS ===");
    console.log("Single set-cookie header:", setCookieHeader);
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
    } else {
      console.log("No JSESSIONID found in any Set-Cookie headers");
    }

    // Check if the user is authenticated based on your servlet response
    if (userData.authenticated === true) {
      // Transform the data to match your frontend UserData interface
      const transformedData = {
        id: userData.user_id,
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        province: userData.province,
        city: userData.city,
        postalCode: userData.postal_code || userData.postalCode,
        address: userData.address,
        verificationRequired: userData.verification_required,
        status: userData.status,
        authenticated: userData.authenticated,
        provinces: provinces,
        cities: cities
      };
      
      return NextResponse.json(transformedData);
    } else {
      // User is not authenticated
      return NextResponse.json(
        { error: 'User not authenticated', authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in userinfo API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 