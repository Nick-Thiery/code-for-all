import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModuleQuiz } from "@/components/module-quiz";
import { PageBody, PageHeader } from "@/components/page-header";
import { PrevNext } from "@/components/prev-next";
import { getModule, getModules, getSkillsCheckFor, parseModuleParam } from "@/lib/lessons";
import { moduleCompleteHref, moduleTrackHref, quizId, skillsCheckHref } from "@/lib/outline";

type Props = { params: Promise<{ module: string }> };

// /module-N/quiz, for every module with a content/module-N/quiz.yml.
export async function generateStaticParams() {
  const modules = await getModules();
  return modules.filter((mod) => mod.quiz).map((mod) => ({ module: `module-${mod.number}` }));
}

async function find(params: Props["params"]) {
  const number = parseModuleParam((await params).module);
  const mod = number === null ? null : await getModule(number);
  return mod?.quiz ? { ...mod, quiz: mod.quiz } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = await find(params);
  return mod ? { title: `Module ${mod.number} quiz`, description: `Questions on the lessons in ${mod.title}.` } : {};
}

export default async function QuizPage({ params }: Props) {
  const mod = await find(params);
  if (!mod) notFound();
  const last = mod.lessons[mod.lessons.length - 1];
  const skillsCheck = await getSkillsCheckFor(mod.number);

  return (
    <article>
      <PageHeader
        tone="sky"
        kicker={
          <Link href={moduleTrackHref(mod.number)} className="no-underline hover:underline">
            Module {mod.number} · {mod.title}
          </Link>
        }
        title={`Module ${mod.number} quiz`}
        sticker={{ big: String(mod.quiz.length), small: mod.quiz.length === 1 ? "question" : "questions" }}
      >
        <p>
          Questions on this module&apos;s lessons. It&apos;s just for you: get a lesson&apos;s questions right and it
          levels up, and if you get one wrong, you&apos;ll see which lesson explains it.
        </p>
      </PageHeader>
      <PageBody className="gap-10 desktop:gap-14">
        <ModuleQuiz
          id={quizId(mod.number)}
          label="Quiz"
          questions={mod.quiz}
          masterAt={
            skillsCheck
              ? { href: skillsCheckHref(skillsCheck.after), label: `Check your skills after Module ${skillsCheck.after}` }
              : undefined
          }
        />

        <PrevNext
          label={`Module ${mod.number}`}
          previous={{ label: `Previous · Lesson ${last.number}`, title: last.title, href: last.href }}
          next={{
            label: `You've finished Module ${mod.number}`,
            title: "See what's next",
            href: moduleCompleteHref(mod.number),
          }}
        />
      </PageBody>
    </article>
  );
}
