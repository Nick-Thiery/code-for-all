import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="display text-[2.25rem] leading-[1.08] sm:text-5xl">There&apos;s no page here</h1>
      <p className="mt-4 text-xl leading-relaxed">
        Check the address, or go back to{" "}
        <Link href="/" className="link">
          the lessons
        </Link>
        .
      </p>
    </>
  );
}
