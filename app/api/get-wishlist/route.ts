import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward cookies from the incoming request
    const cookieHeader = request.headers.get('cookie');
    console.log("=== GET WISHLIST DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);

    // Forward the request to the Java backend GetWishlist servlet
    const backendRes = await fetch("http://localhost:8080/kaidenz/GetWishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
    });

    console.log("Backend response status:", backendRes.status);
    console.log("Backend response headers:", Object.fromEntries(backendRes.headers.entries()));

    // Check if response is ok
    if (!backendRes.ok) {
      console.log("Backend response not ok:", backendRes.status, backendRes.statusText);
      // Return empty wishlist if backend is not available
      return NextResponse.json({ 
        success: true, 
        wishlistItems: [],
        count: 0 
      });
    }

    // Try to parse JSON response
    let data;
    try {
      data = await backendRes.json();
      console.log("Backend GetWishlist response:", data);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      // If JSON parsing fails, try to get text response to see what we're getting
      const textResponse = await backendRes.text();
      console.log("Backend text response (first 500 chars):", textResponse.substring(0, 500));
      
      // Return empty wishlist as fallback
      return NextResponse.json({ 
        success: true, 
        wishlistItems: [],
        count: 0 
      });
    }

    if (data.status) {
      // Transform the backend response to match frontend expectations
      const backendItems = data.items || [];
      const wishlistItems = backendItems.map((item: any) => ({
        id: item.wishlistId, // This is the wishlist item ID
        product: {
          id: item.productId,
          name: item.name,
          basePrice: item.basePrice,
          imageUrls: item.images || [], // Use the images array from backend
          description: item.description,
          qty: item.qty,
          category: item.category
        },
        user: {
          id: 1 // We'll use a default user ID since it's not in the response
        }
      }));
      
      const count = wishlistItems.length;
      
      console.log("Transformed wishlist items:", wishlistItems);
      
      return NextResponse.json({ 
        success: true, 
        wishlistItems,
        count
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        wishlistItems: [],
        count: 0 
      });
    }
  } catch (error) {
    console.error("Error in get-wishlist API route:", error);
    // Return empty wishlist on any error
    return NextResponse.json({ 
      success: true, 
      wishlistItems: [],
      count: 0 
    });
  }
} 