import { formatRange, site } from "@/lib/site";

export function OpeningHours({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <dl className="space-y-4">
      {site.hours.map((h) => (
        <div key={h.label} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[15px]">
          <dt className={`font-semibold ${dark ? "text-cream" : "text-ink"}`}>{h.label}</dt>
          <dd className={dark ? "text-cream/70" : "text-muted"}>
            {h.services.map((s) => (
              <span key={s.name} className="block">
                {s.name} {formatRange(s.open, s.close)}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
