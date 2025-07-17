import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email and password are required" },
        { status: 400 }
      );
    }

    // Forward cookies from the incoming request (if any)
    const cookieHeader = req.headers.get('cookie');
    console.log("=== SIGNIN DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);

    // Forward the request to the Java backend with credentials
    console.log("Sending request to backend with cookies:", cookieHeader);
    const backendRes = await fetch("http://localhost:8080/kaidenz/SignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();
    console.log("Backend response data:", data);
    console.log("Backend response status:", backendRes.status);

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

    // Set additional cookies for frontend use if signin is successful
    if (data.status && data.user_id) {
      console.log("Setting additional frontend cookies for user:", data.user_id);
      
      // Set user_id cookie for frontend access
      response.cookies.set("user_id", data.user_id, {
        httpOnly: false,
        path: "/",
        secure: false, // Set to false for HTTP development
        sameSite: "lax", // Use "lax" for HTTP development
        maxAge: 3600
      });

      // Set user status cookie
      const userStatus = data.verification_required ? "unverified" : "verified";
      response.cookies.set("user_status", userStatus, {
        httpOnly: false,
        path: "/",
        secure: false, // Set to false for HTTP development
        sameSite: "lax", // Use "lax" for HTTP development
        maxAge: 3600
      });

      // If user is verified, set additional user info cookies
      if (!data.verification_required) {
        if (data.email) {
          response.cookies.set("user_email", data.email, {
            httpOnly: false,
            path: "/",
            secure: false, // Set to false for HTTP development
            sameSite: "lax", // Use "lax" for HTTP development
            maxAge: 3600
          });
        }
        
        if (data.first_name) {
          response.cookies.set("user_first_name", data.first_name, {
            httpOnly: false,
            path: "/",
            secure: false, // Set to false for HTTP development
            sameSite: "lax", // Use "lax" for HTTP development
            maxAge: 3600
          });
        }
        
        if (data.last_name) {
          response.cookies.set("user_last_name", data.last_name, {
            httpOnly: false,
            path: "/",
            secure: false, // Set to false for HTTP development
            sameSite: "lax", // Use "lax" for HTTP development
            maxAge: 3600
          });
        }
      }
    }

    // Log final response headers
    console.log("=== FINAL RESPONSE HEADERS ===");
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return response;
  } catch (err) {
    console.error("Error in /api/signin:", err);
    return NextResponse.json({ 
      error: "Invalid request or server error" 
    }, { status: 500 });
  }
}