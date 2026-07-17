import { AboutSection } from "@/components/sections/AboutSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TargetAudienceSection } from "@/components/sections/TargetAudienceSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";

export default function Home() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<TargetAudienceSection />
			<BenefitsSection />
			<WhyChooseUsSection />
			<ContactSection />
		</>
	);
}
