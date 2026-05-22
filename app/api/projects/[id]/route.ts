import { NextResponse } from "next/server";

import { projects } from "@/data/projects";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const project = projects.find((item) => String(item.id) === id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
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
