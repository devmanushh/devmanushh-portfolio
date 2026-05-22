import { NextResponse } from "next/server";
import { experience } from "@/data/experience";

export async function GET() {
  return NextResponse.json(experience);
}

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    message: "Experience created",
    data: body,
  });
}