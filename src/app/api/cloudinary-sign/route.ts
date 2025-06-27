import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables.
console.log("API key present?", {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/cloudinary-sign
 * Receives `paramsToSign` from the next-cloudinary widget and returns the
 * required `timestamp` and `signature` so the client can perform a signed
 * upload without exposing the API secret.
 */
export async function POST(req: NextRequest) {
  try {
    const { paramsToSign } = await req.json();

    console.log(paramsToSign);

    // Combine any incoming params (e.g. folder, public_id) with timestamp.
    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("[cloudinary-sign]", error);
    return new NextResponse("Failed to generate signature", { status: 500 });
  }
}
