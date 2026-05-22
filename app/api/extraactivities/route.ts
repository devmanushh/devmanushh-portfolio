import { NextResponse } from "next/server";
import { mapPlaces } from "@/data/mapPlaces";

export async function GET() {
  return NextResponse.json(mapPlaces);
}

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    message: "Extra activity item created",
    data: body,
  });
}
