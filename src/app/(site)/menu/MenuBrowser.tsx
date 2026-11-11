"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { VegMark } from "@/components/VegMark";
import { formatPrice, menu } from "@/lib/menu";
import { photos } from "@/lib/photos";

export function MenuBrowser() {
  const [vegOnly, setVegOnly] = useState(false);

  const categories = menu
    .map((c) => ({ ...c, dishes: vegOnly ? c.dishes.filter((d) => d.diet === "veg") : c.dishes }))
    .filter((c) => c.dishes.length > 0);

  return (
    <>
      {/* Category bar, sticks under the site header */}
      <div className="sticky top-16 z-30 border-b border-sand bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6">
          <nav aria-label="Menu sections" className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto py-3 [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] lg:[mask-image:none]">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-sand hover:text-ink"
              >
                {c.title}
              </a>
            ))}
          </nav>
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-sand bg-white px-3 py-1.5 text-sm font-medium">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-5 w-9 rounded-full bg-sand transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-[#2f8a3b] peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
            />
            Veg only
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16">
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <VegMark diet="veg" /> Vegetarian
          </span>
          <span className="inline-flex items-center gap-2">
            <VegMark diet="non-veg" /> Non-vegetarian
          </span>
          <span className="inline-flex items-center gap-2">
            <Chilli /> Spicy
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="rounded-full bg-saffron/25 px-2 py-0.5 text-xs font-semibold text-[#7a4c0c]">
              Signature
            </span>
            Our most-ordered dishes
          </span>
        </div>

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-32">
              <h2 className="font-display text-3xl font-semibold tracking-tight">{category.title}</h2>
              {category.note && <p className="mt-1.5 text-sm text-muted">{category.note}</p>}
              <ul className="mt-6 divide-y divide-sand">
                {category.dishes.map((dish) => {
                  const photo = dish.photo ? photos[dish.photo] : null;
                  return (
                    <li key={dish.name} className="flex gap-4 py-4">
                      {photo && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                          <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <VegMark diet={dish.diet} className="relative top-0.5" />
                          <h3 className="font-semibold leading-snug">
                            {dish.name}
                            {dish.spicy && (
                              <span className="ml-1.5 inline-block align-[-2px]">
                                <Chilli />
                              </span>
                            )}
                            {dish.signature && (
                              <span className="ml-2 whitespace-nowrap rounded-full bg-saffron/25 px-2 py-0.5 align-[2px] text-[11px] font-semibold uppercase tracking-wide text-[#7a4c0c]">
                                Signature
                              </span>
                            )}
                          </h3>
                          <span aria-hidden="true" className="mx-1 hidden flex-1 border-b border-dotted border-muted/40 sm:block" />
                          <span className="ml-auto shrink-0 font-semibold tabular-nums">{formatPrice(dish.price)}</span>
                        </div>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted">{dish.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl bg-sand/70 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-lg text-lg">
            Hungry already? Tables fill up quickly on Friday and Saturday nights.
          </p>
          <Link
            href="/book"
            className="rounded-full bg-cocoa px-6 py-3 font-semibold text-cream transition-colors hover:bg-cocoa-light"
          >
            Book a table
          </Link>
        </div>
      </div>
    </>
  );
}

function Chilli() {
  return (
    <svg viewBox="0 0 16 16" className="inline-block h-4 w-4 text-chili" role="img" aria-label="Spicy">
      <path
        fill="currentColor"
        d="M11.6 2.2c.3-.4.9-.4 1.1.1.2.4 0 .8-.3 1 .9.6 1.3 1.6 1.1 2.8-.5 3.6-4.6 7.6-9.9 7.9-.9 0-1.3-1-.6-1.5 2.6-1.8 4.3-4.6 5.2-7.4.4-1.3 1.6-2.1 2.8-2 .2-.3.4-.6.6-.9z"
      />
    </svg>
  );
}
