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

export function WhyChooseUsSection() {
	const reduceMotion = useShouldReduceMotion();
	const mobile = isMobileDevice();
	const duration = getAnimationDuration(reduceMotion, mobile);

	const steps = [
		{
			number: "1",
			title: "Analyse de vos besoins",
			intro: "Écoute, compréhension et définition fine de votre projet.",
			description: "Nous analysons votre projet en profondeur :",
			bullets: [
				"type d'actif recherché (bureau, commerce, entrepôt, terrain…),",
				"budget, rendement ou potentiel recherché,",
				"localisation idéale,",
				"contraintes techniques, juridiques ou opérationnelles.",
			],
			conclusion:
				"Notre objectif : définir une feuille de route précise qui évite les pertes de temps et les visites inutiles.",
		},
		{
			number: "2",
			title: "Recherche ciblée",
			intro:
				"Identification et sélection d'actifs sur-mesure, correspondant à vos critères.",
			description: "Nous activons un réseau professionnel composé :",
			bullets: [
				"de propriétaires,",
				"d'investisseurs,",
				"de promoteurs,",
				"de notaires,",
				"d'agents indépendants.",
			],
			conclusion:
				"Grâce à ce réseau, nous trouvons des opportunités non visibles sur le marché public, avant tout le monde. Nous vous présentons uniquement des dossiers pertinents, réalistes et conformes à vos critères.",
		},
		{
			number: "3",
			title: "Suivi administratif & financier",
			intro: "De la visite à la signature, en toute sérénité.",
			description: "Nous gérons l'ensemble du processus :",
			bullets: [
				"organisation des visites,",
				"analyse financière,",
				"vérifications administratives,",
				"coordination notariale,",
				"négociation stratégique,",
				"suivi jusqu'au compromis et à l'acte.",
			],
			conclusion:
				"Vous bénéficiez d'un interlocuteur unique, réactif et transparent.",
		},
	];

	const specializations = [
		"Opportunités hors-marché (non diffusées au grand public)",
		"Discrétion & confidentialité assurées",
		"Un réseau réactif de partenaires qualifiés (notaires, juristes, financiers, topographes)",
	];

	return (
		<Section id={sectionIds.whyChooseUs}>
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
						Comment ça marche
					</h2>
					<p className="text-xl text-gray-600">
						Notre accompagnement se déroule en 3 étapes claires
					</p>
				</motion.div>

				<motion.div
					className="space-y-8 md:space-y-12 mb-16"
					variants={staggerContainer}
					custom={{ staggerDelay: 0.1 }}
				>
					{steps.map((step) => (
						<motion.div
							key={`step-${step.number}`}
							className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100"
							variants={fadeInUp}
							custom={{ duration: duration / 1000 }}
						>
							<div className="flex flex-col items-center text-center mb-6">
								<div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
									{step.number}
								</div>
								<h3 className="text-xl md:text-2xl font-semibold mb-4">
									{step.title}
								</h3>
							</div>

							<div className="max-w-3xl mx-auto space-y-4">
								{step.intro && (
									<p className="text-lg font-medium text-gray-800">
										{step.intro}
									</p>
								)}

								{step.description && (
									<p className="text-gray-700">{step.description}</p>
								)}

								{step.bullets && step.bullets.length > 0 && (
									<ul className="space-y-3 mt-4">
										{step.bullets.map((bullet) => (
											<li
												key={`${step.number}-${bullet}`}
												className="flex items-start text-gray-700"
											>
												<svg
													className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5"
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
												<span>{bullet}</span>
											</li>
										))}
									</ul>
								)}

								{step.conclusion && (
									<p className="text-gray-700 font-medium mt-6 pt-4 border-t border-gray-200">
										{step.conclusion}
									</p>
								)}
							</div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					className="bg-gray-50 rounded-lg p-8"
					variants={fadeInUp}
					custom={{ duration: duration / 1000, delay: 0.2 }}
				>
					<h3 className="text-2xl font-semibold mb-6 text-center">
						Notre + spécialité
					</h3>
					<motion.ul
						className="space-y-4 max-w-2xl mx-auto"
						variants={staggerContainer}
						custom={{ staggerDelay: 0.08 }}
					>
						{specializations.map((item) => (
							<motion.li
								key={item}
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
								<span className="text-gray-700">{item}</span>
							</motion.li>
						))}
					</motion.ul>
				</motion.div>

				<motion.div
					className="text-center mt-12"
					variants={fadeInUp}
					custom={{ duration: duration / 1000, delay: 0.3 }}
				>
					<CTA>Obtenir une consultation</CTA>
				</motion.div>
			</motion.div>
		</Section>
	);
}
