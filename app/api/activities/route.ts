import { NextResponse } from "next/server";
import { addActivity, getActivities } from "@/lib/activities-store";

export async function GET() {
  const activities = await getActivities();

  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const body = await request.json();
  const activity = await addActivity(body);

  return NextResponse.json(activity, { status: 201 });
}
