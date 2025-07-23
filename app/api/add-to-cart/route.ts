import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1, colorId = 1 } = await req.json();

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Forward cookies from the incoming request
    const cookieHeader = req.headers.get('cookie');
    console.log("=== ADD TO CART DEBUG ===");
    console.log("Incoming cookies:", cookieHeader);
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);
    console.log("Color ID:", colorId);

    // Forward the request to the Java backend AddToCart servlet
    const backendRes = await fetch("http://localhost:8080/kaidenz/AddToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
      body: JSON.stringify({ 
        productId, 
        quantity, 
        colorId 
      }),
    });

    const data = await backendRes.json();
    console.log("Backend AddToCart response:", data);

    if (backendRes.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || "Failed to add product to cart" },
        { status: backendRes.status }
      );
    }
  } catch (error) {
    console.error("Error in add-to-cart API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 