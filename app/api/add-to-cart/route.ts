// app/api/add-to-cart/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1, colorId = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Read cookies coming into this API route
    const incomingCookieHeader = req.headers.get("cookie") || "";

    // Prefer a verified user id from your auth; here we read the existing cookie you showed
    const userIdCookie = req.cookies.get("user_id")?.value;
    const resolvedUserId = userIdCookie ? decodeURIComponent(userIdCookie) : undefined;

    // Forward to Java backend
    const backendRes = await fetch("http://localhost:8080/kaidenz/AddToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        ...(resolvedUserId ? { "X-User-Id": resolvedUserId } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        productId,
        quantity,
        colorId,
      }),
    });

    const data = await backendRes.json().catch(() => ({}));

    return NextResponse.json(
      backendRes.ok ? data : { error: data?.error || "Failed to add product to cart" },
      { status: backendRes.status }
    );
  } catch (error) {
    console.error("Error in add-to-cart API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
