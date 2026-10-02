import type { Metadata } from "next";
import { CourseGrid } from "@/components/course-grid";
import { getOutline } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Contents",
  description:
    "Every Code for All module and lesson, with your progress, mastery levels and quiz scores. Pick a module to see its lessons.",
};

// /contents: the course grid (components/course-grid.tsx) on navy. It opens on
// the learner's current module; /contents#module-N opens another, which is
// where lesson, quiz and Check your skills pages link back to.
export default async function ContentsPage() {
  const outline = await getOutline();
  return (
    <section id="contents" aria-label="Course" className="on-navy scroll-mt-0 px-(--gut)">
      <div className="mx-auto max-w-[1200px] pt-16 pb-[70px] desktop:pt-[120px] desktop:pb-[130px]">
        <CourseGrid outline={outline} />
      </div>
    </section>
  );
}
