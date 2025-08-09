// app/api/delete-cart/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { cartItemId } = await request.json();

    if (!cartItemId && cartItemId !== 0) {
      return NextResponse.json(
        { success: false, error: "cartItemId is required" },
        { status: 400 }
      );
    }

    const incomingCookieHeader = request.headers.get("cookie") || "";
    const match = incomingCookieHeader.match(/(?:^|;\s*)user_id=([^;]+)/);
    const resolvedUserId = match ? decodeURIComponent(match[1]) : undefined;

    const res = await fetch("http://localhost:8080/kaidenz/DeleteCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(incomingCookieHeader ? { Cookie: incomingCookieHeader } : {}),
        ...(resolvedUserId ? { "X-User-Id": resolvedUserId } : {}),
      },
      body: JSON.stringify({ cartItemId }),
    });

    const text = await res.text();
    let data: any;
    try {
      data = text.trim() ? JSON.parse(text) : { success: false, error: "Empty response" };
    } catch {
      data = { success: false, error: "Invalid JSON from server" };
    }

    return NextResponse.json(
      res.ok ? data : { success: false, error: data?.error || "Failed to delete cart item" },
      { status: res.status }
    );
  } catch (err: any) {
    console.error("Error in Next POST→DeleteCart:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization, X-User-Id",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
