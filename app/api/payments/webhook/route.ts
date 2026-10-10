import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes("YourRazorpayWebhookSecretHere")) {
      // In sandbox mode without production webhook secret configured
      return NextResponse.json({ status: "acknowledged", mode: "sandbox" });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      console.log(`Payment captured via webhook: ${paymentEntity.id} for amount ${paymentEntity.amount / 100}`);
      // Record or update verified payment in database
    }

    return NextResponse.json({ status: "success" });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
