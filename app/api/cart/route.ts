import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Forward cookies from the incoming request (if any)
    const cookieHeader = req.headers.get('cookie');
    console.log("=== CART CHECK SESSION DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);

    // Forward the request to the Java backend's CheckSession endpoint
    console.log("Sending request to backend CheckSession with cookies:", cookieHeader);
    const backendRes = await fetch("http://localhost:8080/kaidenz/CheckSession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
      body: JSON.stringify({}), // Empty POST request as requested
    });

    const data = await backendRes.json();
    console.log("Backend CheckSession response data:", data);
    console.log("Backend CheckSession response status:", backendRes.status);

    // Check all response headers from backend
    console.log("=== BACKEND RESPONSE HEADERS ===");
    backendRes.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Get Set-Cookie headers specifically
    const setCookieHeader = backendRes.headers.get('set-cookie');
    const allSetCookies = backendRes.headers.getSetCookie?.() || [];
    
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

    // Create response
    const response = NextResponse.json(data, { status: backendRes.status });
    
    // Set JSESSIONID cookie if we found it
    if (jsessionValue) {
      console.log("Setting JSESSIONID cookie:", jsessionValue);
      
      // Set the JSESSIONID cookie for the frontend domain
      response.cookies.set("JSESSIONID", jsessionValue, {
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

    // Log final response headers
    console.log("=== FINAL RESPONSE HEADERS ===");
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return response;
  } catch (err) {
    console.error("Error in /api/cart:", err);
    return NextResponse.json({ 
      error: "Invalid request or server error" 
    }, { status: 500 });
  }
} 