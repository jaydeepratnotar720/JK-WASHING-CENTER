import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, booking_id, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. Order creation
    if (action === "create_order") {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
      }

      // If Razorpay credentials are not set, return simulated gateway order for local sandbox
      if (!keyId || !keySecret || keyId.includes("YourKeyIdHere")) {
        return NextResponse.json({
          order_id: `order_mock_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: "INR",
          is_mock: true,
          message: "Razorpay Sandbox Mode: Simulated order created",
        });
      }

      // In production with credentials, create order via Razorpay API
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // in paise
          currency: "INR",
          receipt: booking_id || `rec_${Date.now()}`,
        }),
      });

      const orderData = await rzpRes.json();
      return NextResponse.json(orderData);
    }

    // 2. Server-side payment verification (HMAC SHA256)
    if (action === "verify_payment") {
      if (!razorpay_order_id || !razorpay_payment_id) {
        return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
      }

      if (!keySecret || keySecret.includes("YourRazorpaySecretKeyHere")) {
        // Safe sandbox verification fallback
        return NextResponse.json({
          verified: true,
          is_mock: true,
          transaction_reference: razorpay_payment_id,
          message: "Sandbox payment verified successfully",
        });
      }

      // Server-side HMAC SHA256 signature verification
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return NextResponse.json(
          { error: "Invalid payment signature. Payment cannot be verified." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        verified: true,
        transaction_reference: razorpay_payment_id,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
