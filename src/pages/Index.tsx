import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ApproachSection } from "@/components/ApproachSection";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AmbientOrbs } from "@/components/AmbientOrbs";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientOrbs />
      <Nav />
      <main>
        <Hero />
        <ApproachSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
