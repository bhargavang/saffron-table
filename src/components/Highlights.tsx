const highlights = [
  {
    title: "Tandoor classics",
    body: "Breads, kebabs and tikkas fired fresh in our clay oven, all day long.",
  },
  {
    title: "Family recipes",
    body: "Dishes passed down three generations, slow-cooked the way they should be.",
  },
  {
    title: "Book in seconds",
    body: "Reserve online any time and we'll confirm your table by email.",
  },
];

export function Highlights() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.6fr] md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">
              Why guests come back
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Cooked slow. Served warm. Shared generously.
            </h2>
          </div>

          <ol className="grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-sand">
            {highlights.map((item, i) => (
              <li key={item.title} className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-4xl font-light italic text-[#9a5f14]">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
