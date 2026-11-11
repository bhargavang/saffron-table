import { pageMetadata } from "@/lib/seo";

import { MenuBrowser } from "./MenuBrowser";

export const metadata = pageMetadata({
  title: "Menu",
  description:
    "Tandoor kebabs, dal makhani cooked overnight, Hyderabadi dum biryani, lunch thalis and fresh breads. Full menu with prices and veg/non-veg marks.",
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <section className="bg-cocoa text-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Menu</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Cooked slow, priced fairly
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/70">
            Everything is made in our kitchen, from the paneer to the pickles. Prices
            include GST. Tell us about any allergies when you book.
          </p>
        </div>
      </section>
      <MenuBrowser />
    </>
  );
}
