// app/api/cart/route.ts (PUT)  — Next.js API route that forwards auth + body
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward all incoming cookies
    const incomingCookieHeader = request.headers.get("cookie") || "";

    // Extract a stable user id (use your real auth/JWT in production)
    const m = incomingCookieHeader.match(/(?:^|;\s*)user_id=([^;]+)/);
    const resolvedUserId = m ? decodeURIComponent(m[1]) : undefined;

    const backendRes = await fetch("http://localhost:8080/kaidenz/UpdateCart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        ...(resolvedUserId ? { "X-User-Id": resolvedUserId } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      backendRes.ok ? data : { success: false, error: data?.error || "Failed to update cart" },
      { status: backendRes.status }
    );
  } catch (err) {
    console.error("Error updating cart:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// (Optional) If you really need this for your own API route:
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      // This OPTIONS is for your Next.js route only; backend CORS is handled in Java
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization, X-User-Id",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
