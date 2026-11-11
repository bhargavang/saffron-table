import Link from "next/link";

import { Logo } from "@/components/Logo";
import { demoPasswordInUse } from "@/lib/admin-session";

import { LoginForm } from "./LoginForm";

export const metadata = { title: "Staff sign-in" };

export default function LoginPage() {
  const demoPassword = demoPasswordInUse();
  const hint =
    process.env.ADMIN_LOGIN_HINT || (demoPassword ? `Demo password: ${demoPassword}` : undefined);

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-cocoa px-4 py-16 text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-saffron/20 blur-3xl"
      />
      <div className="relative w-full max-w-sm">
        <Logo />
        <div className="mt-8 rounded-3xl bg-cream p-7 text-ink shadow-2xl sm:p-8">
          <h1 className="font-display text-2xl font-semibold">Staff sign-in</h1>
          <p className="mt-1.5 text-sm text-muted">See and answer table bookings.</p>
          <LoginForm />
          {hint && <p className="mt-5 rounded-xl bg-saffron/15 px-3.5 py-2.5 text-sm">{hint}</p>}
        </div>
        <Link href="/" className="mt-6 inline-block text-sm text-cream/60 hover:text-cream">
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
