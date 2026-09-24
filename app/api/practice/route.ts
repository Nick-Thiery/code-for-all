import { NextResponse } from "next/server";
import { isPracticeSubmission } from "@/lib/practice";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be JSON." }, { status: 400 });
  }

  if (!isPracticeSubmission(body)) {
    return NextResponse.json(
      { error: 'Expected a body like { "taskId": "some-task", "prompt": "..." }.' },
      { status: 400 },
    );
  }

  // Stub: a hardcoded response. Real grading goes here.
  return NextResponse.json({
    taskId: body.taskId,
    status: "ungraded",
    feedback: "Grading isn't set up yet. This is a placeholder response from app/api/practice/route.ts.",
  });
}
