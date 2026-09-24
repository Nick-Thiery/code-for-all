import { NextResponse } from "next/server";
import { isPracticeSubmission } from "@/lib/practice";
import { MOCK_NAMES, isMockName, mockGrade } from "@/lib/practice-mock";

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

  // ?mock=<name> forces one of the fixture answers. See lib/practice-mock.ts.
  const mock = new URL(request.url).searchParams.get("mock");
  if (mock !== null && !isMockName(mock)) {
    return NextResponse.json(
      { error: `Unknown mock "${mock}". Use one of: ${MOCK_NAMES.join(", ")}.` },
      { status: 400 },
    );
  }

  // Mock grading for now. Real grading goes here, answering with the same
  // PracticeResponse shape (lib/practice.ts).
  const { status, body: answer } = mockGrade(body, mock);
  return NextResponse.json(answer, { status });
}
