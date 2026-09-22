import type { Metadata } from "next";

import { PublicFooter } from "@/components/layout/public/PublicFooter";
import { PublicNavbar } from "@/components/layout/public/PublicNavbar";
import { CommunityCta } from "@/modules/home/components/CommunityCta";
import { ContactSection } from "@/modules/home/components/ContactSection";
import { EventsCalendar } from "@/modules/home/components/EventsCalendar";
import { FeaturedListings } from "@/modules/home/components/FeaturedListings";
import { HeroSection } from "@/modules/home/components/HeroSection";
import { MarketplaceIntro } from "@/modules/home/components/MarketplaceIntro";
import { MerchSlider } from "@/modules/home/components/MerchSlider";
import { NewsletterCta } from "@/modules/home/components/NewsletterCta";
import { PlatformBenefits } from "@/modules/home/components/PlatformBenefits";
import { PricingPlans } from "@/modules/home/components/PricingPlans";
import { Testimonials } from "@/modules/home/components/Testimonials";
import { TopBanner } from "@/modules/home/components/TopBanner";

export const metadata: Metadata = {
  title: "Panama Car Republic — Marketplace automotriz de Panamá",
  description:
    "El marketplace automotriz más completo de Panamá. Miles de autos, piezas y coleccionables.",
};

// Server Component: it only composes sections, in the order of the Figma frame
// "Inicio • Desktop" (10167:12355). Interactivity lives in the leaves that need
// it (TopBanner, PublicNavbar, SearchFilterBar, PricingPlans, MerchSlider,
// EventsCalendar, NewsletterCta, ContactSection).
export default function HomePage() {
  return (
    <>
      <TopBanner />
      <PublicNavbar />
      <main>
        <HeroSection />
        <FeaturedListings />
        <MarketplaceIntro />
        <PlatformBenefits />
        <PricingPlans />
        <CommunityCta />
        <MerchSlider />
        <Testimonials />
        <EventsCalendar />
        <NewsletterCta />
        <ContactSection />
      </main>
      <PublicFooter />
    </>
  );
}
