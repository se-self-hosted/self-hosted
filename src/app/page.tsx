import { LandingWelcomeFlow } from "@/components/landing/LandingWelcomePreview";
import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  let user = null;
  try {
    user = await getUserFromRequest();
  } catch {
    // Authentication infrastructure failures must not leave guests on a blank screen.
  }
  if (user) redirect("/dashboard");

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-paper text-ink">
      <LandingWelcomeFlow />
    </main>
  );
}
