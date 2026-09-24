import { CourseTrack, type TrackLesson } from "@/components/course-track";
import { getLessons } from "@/lib/lessons";
import { site } from "@/lib/site";

export default async function CoursePage() {
  const lessons = await getLessons();
  // Only what the track shows goes to the browser, not each lesson's full text.
  const track: TrackLesson[] = lessons.map(({ slug, title, summary, duration, requiresAccount }) => ({
    slug,
    title,
    summary,
    duration,
    requiresAccount,
  }));

  return (
    <>
      <h1 className="display max-w-[16ch] text-[2.5rem] leading-[1.05] sm:text-6xl">{site.tagline}</h1>
      <p className="mt-5 max-w-[36em] text-xl leading-relaxed">{site.description}</p>

      <div className="mt-10">
        {track.length > 0 ? (
          <CourseTrack lessons={track} />
        ) : (
          <p className="rounded-xl bg-surface p-5">
            No lessons yet. Add an <code>.mdx</code> file to <code>content/lessons/</code> and it will show up here.
          </p>
        )}
      </div>
    </>
  );
}
