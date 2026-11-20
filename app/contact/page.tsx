import type { Metadata } from "next";
import DemoNavbarSectionTwo from "@/components/ui/navbar-section-2-demo";
import ContactSection from "@/components/ui/contact-section";
import SiteFooter from "@/components/ui/site-footer";

export const metadata: Metadata = {
  title: "Contact & Book a Call — Workseez",
  description: "Book a free strategy call with Workseez. Pick a time that suits you and we'll come prepared with ideas for your brand.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <DemoNavbarSectionTwo />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
