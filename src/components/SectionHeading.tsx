export function SectionHeading({
  eyebrow,
  title,
  children,
  tone = "light",
  as: Heading = "h2",
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${className}`}>
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-saffron" : "text-chili"}`}
      >
        {eyebrow}
      </p>
      <Heading
        className={`mt-3 font-display font-semibold tracking-tight text-balance ${
          Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {title}
      </Heading>
      {children && (
        <div className={`mt-4 text-lg leading-relaxed ${dark ? "text-cream/70" : "text-muted"}`}>
          {children}
        </div>
      )}
    </div>
  );
}
