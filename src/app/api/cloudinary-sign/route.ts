import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import GetServerUser from '../../../../libs/GetServerUser';

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
    const user = await GetServerUser();

    if (!user) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const { paramsToSign } = await req.json();

    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature });
  } catch (error) {
    console.error('[cloudinary-sign]', error);
    return new NextResponse('Failed to generate signature', { status: 500 });
  }
}
