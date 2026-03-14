import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
    }

    // Generate a simple OTP or token
    const otp = randomBytes(3).toString('hex').toUpperCase(); // 6 char hex
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordResetOtp.create({
      data: {
        email,
        otp,
        expiresAt,
      }
    });

    // In a real app, send an email here with the OTP. For demo purposes, we will return it in development
    console.log(`[PASSWORD RESET] OTP for ${email}: ${otp}`);

    return NextResponse.json({ message: "If an account exists, a reset link/OTP has been sent." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
