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

      
      console.log("Minimal webhook data:", {
        first_name,
        last_name,
        email_address,
        user_id,
      });

      switch (eventType) {
        case "user.created":
          // Log the data being sent to the external API
          console.log("Sending user data to external API:", {
            first_name,
            last_name,
            email_address,
            user_id,
          });
          // Call external API with user data
          await fetch("http://localhost:8080/kaidenz/SignUp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name,
              last_name,
              email_address,
              user_id,
            }),
          });
          return NextResponse.json({
            first_name,
            last_name,
            email_address,
            user_id,
            event: eventType,
          });
        case "user.updated":
        case "user.deleted":
          // Call external API to delete user
          const deleteRes = await fetch("http://localhost:8080/kaidenz/users/UserDelete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
          });
          const deleteResText = await deleteRes.text();
          console.log("External API user delete response:", {
            status: deleteRes.status,
            body: deleteResText,
          });
          return NextResponse.json({
            user_id,
            event: eventType,
            externalApi: {
              status: deleteRes.status,
              body: deleteResText,
            },
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
