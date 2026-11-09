import { site } from "@/lib/site";

/** Slim strip that tells visitors this is a demo and who built it. */
export function DemoBanner() {
  if (!site.demo.show) return null;

  return (
    <div className="bg-saffron px-4 py-2 text-center text-[13px] leading-snug text-ink">
      <span className="font-medium">Demo website</span> built by{" "}
      {site.demo.builtBy}.{" "}
      <a
        href={site.demo.contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline underline-offset-2 hover:no-underline"
      >
        Want one for your restaurant? Let&apos;s talk →
      </a>
    </div>
  );
}
