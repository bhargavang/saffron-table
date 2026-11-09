const highlights = [
  {
    title: "Tandoor classics",
    body: "Breads, kebabs and tikkas fired fresh in our clay oven, all day long.",
    icon: (
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.3 1.6 1 2.6 2 3.1C11 8.6 11 5.6 12 3z" />
    ),
  },
  {
    title: "Family recipes",
    body: "Dishes passed down three generations, slow-cooked the way they should be.",
    icon: (
      <>
        <path d="M4 11h16v2a8 8 0 0 1-16 0v-2z" />
        <path d="M9 7c0-1.5 1-2 1-3.5M14 7c0-1.5 1-2 1-3.5" />
      </>
    ),
  },
  {
    title: "Book in seconds",
    body: "Reserve online any time and get an instant confirmation by email.",
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" />
      </>
    ),
  },
];

export function Highlights() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">
            Why guests come back
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Cooked slow. Served warm. Shared generously.
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl border border-sand bg-white/70 p-7 transition-shadow hover:shadow-lg hover:shadow-sand"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-chili">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
