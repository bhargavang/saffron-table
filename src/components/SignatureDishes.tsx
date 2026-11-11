import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/SectionHeading";
import { VegMark } from "@/components/VegMark";
import { formatPrice, signatureDishes } from "@/lib/menu";
import { photos } from "@/lib/photos";

export function SignatureDishes() {
  return (
    <section className="bg-sand/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="From the menu" title="The dishes people come back for" />
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 font-semibold text-chili underline-offset-4 hover:underline"
          >
            See the full menu <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signatureDishes.map((dish) => {
            const photo = dish.photo ? photos[dish.photo] : null;
            return (
              <li key={dish.name} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cocoa">
                  {photo && (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 92vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-sm font-semibold text-ink shadow">
                    {formatPrice(dish.price)}
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <VegMark diet={dish.diet} className="mt-1.5" />
                  <h3 className="font-display text-xl font-semibold leading-snug">{dish.name}</h3>
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{dish.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
