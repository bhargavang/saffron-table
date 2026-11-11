import { pageMetadata } from "@/lib/seo";
import { gallery, photos } from "@/lib/photos";

import { GalleryGrid } from "./GalleryGrid";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Inside Saffron Table: the dining room, the tandoor, and the food that comes out of our kitchen in Indiranagar, Bengaluru.",
  path: "/gallery",
});

export default function GalleryPage() {
  const items = gallery.map(({ key, caption }) => ({ ...photos[key], caption }));

  // One credit line per photographer.
  const credits = [...new Map(items.map((p) => [p.handle, p])).values()];

  return (
    <>
      <section className="bg-cocoa text-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Gallery</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            A look around
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/70">
            The room, the kitchen and a few favourites from the menu. Tap any photo to
            see it bigger.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16">
        <GalleryGrid items={items} />

        <div className="mt-14 border-t border-sand pt-8 text-sm leading-relaxed text-muted">
          <p>
            Saffron Table is a demo restaurant, so these are free stock photos from{" "}
            <a
              href="https://unsplash.com/?utm_source=saffron_table&utm_medium=referral"
              className="font-medium text-ink underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Thanks to the photographers:{" "}
            {credits.map((p, i) => (
              <span key={p.handle}>
                <a
                  href={`https://unsplash.com/@${p.handle}?utm_source=saffron_table&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {p.credit}
                </a>
                {i < credits.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}
