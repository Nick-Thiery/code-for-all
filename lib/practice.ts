/** What <PromptPractice> sends to POST /api/practice. */
export type PracticeSubmission = {
  taskId: string;
  prompt: string;
};

export function isPracticeSubmission(value: unknown): value is PracticeSubmission {
  if (typeof value !== "object" || value === null) return false;
  const { taskId, prompt } = value as Record<string, unknown>;
  return typeof taskId === "string" && taskId !== "" && typeof prompt === "string";
}
