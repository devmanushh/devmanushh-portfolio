import { NextResponse } from "next/server";

import { deleteActivity, getActivities } from "@/lib/activities-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const activities = await getActivities();
  const activity = activities.find((item) => String(item.id) === id);

  if (!activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  return NextResponse.json(activity);
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  return NextResponse.json({ ...body, id });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const deleted = await deleteActivity(Number(id));

  return NextResponse.json({ deleted, id });
}
