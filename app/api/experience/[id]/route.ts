import { NextResponse } from "next/server";

import { experience } from "@/data/experience";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const item = experience.find((entry) => String(entry.id) === id);

  if (!item) {
    return NextResponse.json({ error: "Experience not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  return NextResponse.json({ ...body, id });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  return NextResponse.json({ deleted: true, id });
}
