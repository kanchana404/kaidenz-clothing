import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1) Parse JSON from client
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // 2) Grab cookies to forward session
    const cookieHeader = request.headers.get('cookie');

    console.log("=== ADD TO WISHLIST DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);
    console.log("Product ID:", productId);

    // 3) Proxy to Java backend (form‑urlencoded + UTF‑8)
    const body = new URLSearchParams({ productId: String(productId) }).toString();
    const backendRes = await fetch("http://localhost:8080/kaidenz/WishList", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
      body,
    });

    const data = await backendRes.json();
    console.log("Backend WishList response:", data);

    if (backendRes.ok && data.status) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to add product to wishlist" },
        { status: backendRes.status }
      );
    }

  } catch (error) {
    console.error("Error in add-to-wishlist API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
