"use client";

import { motion } from "framer-motion";
import { CTA } from "@/components/ui/CTA";
import { Section } from "@/components/ui/Section";
import { sectionIds } from "@/config/navigation";
import {
	fadeInUp,
	getAnimationDuration,
	isMobileDevice,
	staggerContainer,
	useShouldReduceMotion,
} from "@/lib/animations";

export function BenefitsSection() {
	const reduceMotion = useShouldReduceMotion();
	const mobile = isMobileDevice();
	const duration = getAnimationDuration(reduceMotion, mobile);

	const benefits = [
		"Accédez à des opportunités exclusives que vous ne trouverez pas sur les portails publics — un avantage concurrentiel décisif.",
		"Bénéficiez d'un réseau qualifié qui identifie rapidement les actifs correspondant à vos critères précis.",
		"Profitez d'un accompagnement complet : de l'analyse à la signature, nous gérons chaque étape pour vous.",
		"Gagnez un temps précieux grâce à notre approche ultra-ciblée qui évite les visites inutiles et les dossiers non pertinents.",
		"Travaillez en toute discrétion — la confidentialité est garantie, essentielle pour les transactions hors-marché.",
	];

	return (
		<Section id={sectionIds.benefits}>
			<motion.div
				className="max-w-6xl mx-auto"
				variants={staggerContainer}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
				custom={{ staggerDelay: 0.1 }}
			>
				<motion.div
					className="text-center mb-12"
					variants={fadeInUp}
					custom={{ duration: duration / 1000 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Pourquoi travailler avec Collabimmo ?
					</h2>
				</motion.div>

				<motion.div
					className="bg-gray-50 rounded-lg p-8"
					variants={fadeInUp}
					custom={{ duration: duration / 1000, delay: 0.2 }}
				>
					<motion.ul
						className="space-y-4 max-w-2xl mx-auto"
						variants={staggerContainer}
						custom={{ staggerDelay: 0.08 }}
					>
						{benefits.map((benefit) => (
							<motion.li
								key={benefit}
								className="flex items-start md:justify-center"
								variants={fadeInUp}
								custom={{ duration: duration / 1000 }}
							>
								<svg
									className="w-6 h-6 text-primary mr-3 shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="text-gray-700">{benefit}</span>
							</motion.li>
						))}
					</motion.ul>
				</motion.div>

				<motion.div
					className="text-center mt-12"
					variants={fadeInUp}
					custom={{ duration: duration / 1000, delay: 0.3 }}
				>
					<CTA>Passer à l'action</CTA>
				</motion.div>
			</motion.div>
		</Section>
	);
}
