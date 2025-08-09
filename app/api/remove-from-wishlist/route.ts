import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { wishlistItemId } = await request.json();
    if (!wishlistItemId) {
      return NextResponse.json({ success: false, error: "Wishlist item ID is required" }, { status: 400 });
    }

    const cookieHeader = request.headers.get('cookie');
    console.log("=== REMOVE FROM WISHLIST DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);
    console.log("Wishlist Item ID:", wishlistItemId);

    const backendRes = await fetch("http://localhost:8080/kaidenz/RemoveWishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
      body: `wishlistId=${wishlistItemId}`, // Changed from wishlistItemId to wishlistId
    });

    console.log("Backend response status:", backendRes.status);
    console.log("Backend response headers:", Object.fromEntries(backendRes.headers.entries()));

    if (!backendRes.ok) {
      console.log("Backend response not ok:", backendRes.status, backendRes.statusText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${backendRes.status} ${backendRes.statusText}` },
        { status: backendRes.status }
      );
    }

    let data;
    try {
      data = await backendRes.json();
      console.log("Backend RemoveWishlist response:", data);
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      const textResponse = await backendRes.text();
      console.log("Backend text response:", textResponse);
      return NextResponse.json(
        { success: false, error: "Invalid JSON response from backend" },
        { status: 500 }
      );
    }

    if (data.status) {
      console.log("=== REMOVE FROM WISHLIST SUCCESS ===");
      console.log("Backend successfully removed item, returning success response");
      return NextResponse.json({ success: true, message: data.message });
    } else {
      console.log("=== REMOVE FROM WISHLIST FAILED ===");
      console.log("Backend failed to remove item:", data.message);
      return NextResponse.json(
        { success: false, error: data.message || "Failed to remove from wishlist" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("=== REMOVE FROM WISHLIST ERROR ===");
    console.error("Error in remove-from-wishlist API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 