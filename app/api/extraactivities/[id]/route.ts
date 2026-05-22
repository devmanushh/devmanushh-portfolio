import { NextResponse } from "next/server";

import { mapPlaces } from "@/data/mapPlaces";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const entry = mapPlaces.find((item) => String(item.id) === id);

  if (!entry) {
    return NextResponse.json({ error: "Extra activity entry not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
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
