import { Callout } from "@/components/callout";

/**
 * The safety reminder on every lesson where learners put something online
 * (an About Me site, GitHub, Vercel, Supabase). One wording everywhere.
 * In MDX: <PublishSafely /> or <PublishSafely testEmail />
 */
export function PublishSafely({ testEmail = false }: { testEmail?: boolean }) {
  return (
    <Callout kind="headsup" rail="Safety">
      <p>
        <strong>Before you put anything online:</strong> leave out your full name, your school, your address, your
        phone number and photos of yourself. First name, hobbies and the things you&apos;ve made are plenty.
        {testEmail && " Where this lesson says to use a test email, use one, not your own."}
      </p>
    </Callout>
  );
}
