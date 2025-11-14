import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TargetAudienceSection } from "@/components/sections/TargetAudienceSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TargetAudienceSection />
      <WhyChooseUsSection />
      <ContactSection />
    </>
  );
}
