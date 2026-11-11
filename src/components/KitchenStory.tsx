import Image from "next/image";
import Link from "next/link";

import { photos } from "@/lib/photos";

export function KitchenStory() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:mr-10">
            <Image
              src={photos.chefFlame.src}
              alt={photos.chefFlame.alt}
              fill
              sizes="(min-width: 768px) 460px, 92vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-4 hidden w-44 overflow-hidden rounded-2xl border-4 border-cream shadow-xl sm:block md:-right-2 md:w-52">
            <div className="relative aspect-square">
              <Image
                src={photos.naan.src}
                alt={photos.naan.alt}
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chili">
            Our kitchen
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Built around a clay oven and a lot of patience
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              The tandoor is lit at ten every morning and doesn&apos;t go out until
              the last table leaves. Breads come off its walls to order, and the
              dal sits on its embers overnight.
            </p>
            <p>
              Spices are roasted and ground in-house each week. The menu changes
              a little with the seasons: gajar halwa in winter, raw mango in
              summer, and whatever the market has that looks good.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-sand pt-6">
            <div>
              <dt className="text-sm text-muted">Dal makhani</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">12 hours</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Chicken marinade</dt>
              <dd className="mt-1 font-display text-2xl font-semibold">24 hours</dd>
            </div>
          </dl>
          <Link
            href="/gallery"
            className="mt-8 inline-flex items-center gap-1.5 font-semibold text-chili underline-offset-4 hover:underline"
          >
            Look around inside <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
