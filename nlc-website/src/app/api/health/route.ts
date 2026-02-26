import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "nlc-website",
    timestamp: new Date().toISOString()
  });
}
