import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/SectionHeading";
import { photos, type PhotoKey } from "@/lib/photos";

const tiles: { key: PhotoKey; className: string; sizes: string }[] = [
  { key: "stringLights", className: "col-span-2 row-span-2", sizes: "(min-width: 768px) 560px, 92vw" },
  { key: "tableSpread", className: "", sizes: "(min-width: 768px) 270px, 46vw" },
  { key: "chai", className: "", sizes: "(min-width: 768px) 270px, 46vw" },
  { key: "chefPlating", className: "", sizes: "(min-width: 768px) 270px, 46vw" },
  { key: "warmRoom", className: "", sizes: "(min-width: 768px) 270px, 46vw" },
];

export function GalleryStrip() {
  return (
    <section className="bg-cocoa text-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Gallery" title="A warm room for long dinners" tone="dark">
            Forty seats, low lights and a view of the tandoor from most tables.
          </SectionHeading>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 font-semibold text-saffron underline-offset-4 hover:underline"
          >
            See all photos <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4 md:gap-4">
          {tiles.map(({ key, className, sizes }) => {
            const photo = photos[key];
            return (
              <div key={key} className={`relative overflow-hidden rounded-2xl ${className}`}>
                <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
