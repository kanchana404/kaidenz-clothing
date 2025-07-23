import { NextRequest, NextResponse } from "next/server";
// If you’re on the Node runtime (default), you can use util for deep inspect.
import util from "util";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `http://localhost:8080/kaidenz/SingleProduct?id=${productId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // avoid Next caching if needed
        cache: "no-store",
      }
    );

    const text = await backendRes.text(); // read raw first for safer debug
    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Backend didn't return JSON:", text);
      return NextResponse.json(
        { success: false, error: "Invalid JSON from backend" },
        { status: 502 }
      );
    }

    // Deep logs
    console.log("Backend response status:", backendRes.status);
    console.log(
      "Backend response data:\n",
      util.inspect(data, { depth: null, colors: true })
    );

    if (data.success && data.product) {
      console.log(
        "Colors:\n",
        JSON.stringify(data.product.colors, null, 2)
      );
      console.log(
        "Sizes:\n",
        JSON.stringify(data.product.sizes, null, 2)
      );
      console.log("Number of colors:", data.product.colors?.length ?? 0);
      console.log("Number of sizes:", data.product.sizes?.length ?? 0);
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to fetch product" },
        { status: backendRes.status }
      );
    }

    // (Optional) reshape before sending to client
    // e.g., ensure arrays are plain objects
    // const product = {
    //   ...data.product,
    //   colors: data.product.colors.map((c: any) => ({ id: c.id, name: c.name })),
    //   sizes: data.product.sizes.map((s: any) => ({
    //     id: s.id,
    //     name: s.name,
    //     stockQuantity: s.stockQuantity,
    //     price: s.price ?? null
    //   })),
    // };
    // return NextResponse.json({ success: true, product });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error sending product ID to backend:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send product ID to backend" },
      { status: 500 }
    );
  }
}
