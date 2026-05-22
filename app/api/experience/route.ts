import { NextResponse } from "next/server";

import { experience } from "@/data/experience";

export function GET() {
  return NextResponse.json(experience);
}

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({ ...body, id: body.id ?? crypto.randomUUID() }, { status: 201 });
}
