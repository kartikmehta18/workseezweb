import DemoNavbarSectionTwo from "@/components/ui/navbar-section-2-demo";
import HeroSection from "@/components/ui/hero-section";
import PlatformsSection from "@/components/ui/platforms-section";
import ResultsSection from "@/components/ui/results-section";
import ServicesSection from "@/components/ui/services-section";
import ComparisonSection from "@/components/ui/comparison-section";
import PricingSection from "@/components/ui/pricing-section";
import FaqSection from "@/components/ui/faq-section";
import SiteFooter from "@/components/ui/site-footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <DemoNavbarSectionTwo />
      <HeroSection />
      <PlatformsSection />
      <ResultsSection />
      <ServicesSection />
      <ComparisonSection />
      <PricingSection />
      <FaqSection />
      <SiteFooter />
    </main>
  );
}
