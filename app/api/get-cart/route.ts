// app/api/cart/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Forward all incoming cookies to the Java backend
    const incomingCookieHeader = request.headers.get("cookie") || "";

    // Also extract a trusted user id to pass explicitly (same pattern as AddToCart)
    // Prefer your real auth/JWT; this just mirrors your current cookie.
    const userIdMatch = incomingCookieHeader.match(/(?:^|;\s*)user_id=([^;]+)/);
    const resolvedUserId = userIdMatch ? decodeURIComponent(userIdMatch[1]) : undefined;

    const backendRes = await fetch("http://localhost:8080/kaidenz/GetCart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        ...(resolvedUserId ? { "X-User-Id": resolvedUserId } : {}),
      },
      credentials: "include",
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      backendRes.ok ? data : { success: false, error: data?.error || "Failed to fetch cart" },
      { status: backendRes.status }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
