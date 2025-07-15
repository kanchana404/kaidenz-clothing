import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

// Minimal type for user event data
interface ClerkUser {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses?: { email_address: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const data = evt.data;
    const eventType = evt.type;

    if (typeof eventType === "string" && eventType.startsWith("user.")) {
      const user = data as ClerkUser;
      const first_name = user.first_name;
      const last_name = user.last_name;
      const user_id = user.id;
      const email_address = user.email_addresses?.[0]?.email_address || null;

      // Log only the minimal data
      console.log("Minimal webhook data:", {
        first_name,
        last_name,
        email_address,
        user_id,
      });

      switch (eventType) {
        case "user.created":
        case "user.updated":
        case "user.deleted":
          return NextResponse.json({
            first_name,
            last_name,
            email_address,
            user_id,
            event: eventType,
          });
        default:
          return NextResponse.json(
            { error: `Unhandled user event: ${eventType}` },
            { status: 400 }
          );
      }
    } else {
      return NextResponse.json({ error: "Not a user event." }, { status: 400 });
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
