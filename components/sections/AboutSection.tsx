"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { sectionIds } from "@/config/navigation";
import {
	fadeInUp,
	getAnimationDuration,
	isMobileDevice,
	staggerContainer,
	useShouldReduceMotion,
} from "@/lib/animations";

export function AboutSection() {
	const reduceMotion = useShouldReduceMotion();
	const mobile = isMobileDevice();
	const duration = getAnimationDuration(reduceMotion, mobile);

	return (
		<Section id={sectionIds.about} className="bg-gray-50">
			<div className="max-w-4xl mx-auto bg-primary/5 rounded-lg p-8 md:p-12 shadow-sm">
				<motion.div
					className="text-center"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					custom={{ staggerDelay: 0.1 }}
				>
					<motion.h2
						className="text-3xl md:text-4xl font-bold mb-6"
						variants={fadeInUp}
						custom={{ duration: duration / 1000 }}
					>
						Qui sommes-nous ?
					</motion.h2>
					<motion.p
						className="text-lg text-gray-600 mb-8"
						variants={fadeInUp}
						custom={{ duration: duration / 1000 }}
					>
						Chez Collabimmo, notre mission est simple : vous donner accès à
						toutes les opportunités du marché immobilier professionnel — des
						immeubles de rapport aux terrains en développement, des actifs
						agricoles aux bois et forêts. Notre équipe de chasseurs identifie,
						sécurise et accompagne l'actif qu'il vous faut, où qu'il soit.
					</motion.p>

					<motion.div
						className="mt-12 pt-8 border-t border-gray-200"
						variants={fadeInUp}
						custom={{ duration: duration / 1000, delay: 0.2 }}
					>
						<motion.h3
							className="text-2xl font-bold mb-8 text-center"
							variants={fadeInUp}
							custom={{ duration: duration / 1000 }}
						>
							Notre promesse
						</motion.h3>
						<motion.div
							className="grid md:grid-cols-3 gap-8"
							variants={staggerContainer}
							custom={{ staggerDelay: 0.1 }}
						>
							<motion.div
								className="text-center"
								variants={fadeInUp}
								custom={{ duration: duration / 1000 }}
							>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h4 className="font-semibold text-lg mb-2">Rapidité</h4>
								<p className="text-gray-600">
									Nous réagissons vite, vous ne perdez pas de temps.
								</p>
							</motion.div>

							<motion.div
								className="text-center"
								variants={fadeInUp}
								custom={{ duration: duration / 1000 }}
							>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h4 className="font-semibold text-lg mb-2">Efficacité</h4>
								<p className="text-gray-600">
									Des solutions ciblées, bien documentées, prêtes à agir.
								</p>
							</motion.div>

							<motion.div
								className="text-center"
								variants={fadeInUp}
								custom={{ duration: duration / 1000 }}
							>
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								</div>
								<h4 className="font-semibold text-lg mb-2">Personnalisation</h4>
								<p className="text-gray-600">
									Chaque client, chaque projet est unique — ainsi notre
									approche.
								</p>
							</motion.div>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</Section>
	);
}
