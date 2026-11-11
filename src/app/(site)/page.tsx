import type { Metadata } from "next";

import { BookingCta } from "@/components/BookingCta";
import { GalleryStrip } from "@/components/GalleryStrip";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { KitchenStory } from "@/components/KitchenStory";
import { RestaurantJsonLd } from "@/components/RestaurantJsonLd";
import { SignatureDishes } from "@/components/SignatureDishes";
import { VisitSection } from "@/components/VisitSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <RestaurantJsonLd />
      <Hero />
      <Highlights />
      <SignatureDishes />
      <KitchenStory />
      <GalleryStrip />
      <VisitSection />
      <BookingCta />
    </>
  );
}
