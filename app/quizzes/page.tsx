import type { Metadata } from "next";
import { PageBody, PageHeader } from "@/components/page-header";
import { QuizList } from "@/components/quiz-list";
import { getOutline } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Quizzes",
  description:
    "Every Code for All quiz in one place: each module's quiz and the Check your skills quizzes, with your last score and the lessons to look at again.",
};

// /quizzes: every released module quiz and Check your skills page, grouped by
// phase. The quizzes themselves stay at the end of their modules; this page
// only lists them, from the same outline and saved results (components/quiz-list.tsx).
export default async function QuizzesPage() {
  const outline = await getOutline();
  const checks = outline.modules.filter((mod) => mod.skillsCheck).map((mod) => mod.number);
  const after = checks.length > 1 ? `Modules ${checks.slice(0, -1).join(", ")} and ${checks.at(-1)}` : `Module ${checks[0]}`;
  const intro =
    checks.length > 0
      ? `Each module ends with a short quiz, and after ${after} you can check your skills across the course so far.`
      : "Each module ends with a short quiz.";

  return (
    <article>
      <PageHeader kicker="Quizzes" title="Every quiz in one place">
        <p>{intro} Take them in any order, as often as you like.</p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">
        <QuizList outline={outline} />
      </PageBody>
    </article>
  );
}
