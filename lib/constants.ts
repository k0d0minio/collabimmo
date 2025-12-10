import { siteConfig } from "@/config/site";

export const COMPANY_INFO = siteConfig.company;

export const CONTACT_EMAIL = siteConfig.contact.email;

export const PROPERTY_TYPES = [
	{ value: "vendre-mon-bien", label: "Vendre mon bien" },
	{
		value: "vendre-mes-parts-dentreprise",
		label: "Vendre mes parts d'entreprise",
	},
	{
		value: "relocalisation-ou-delocalisation-dentreprise",
		label: "Relocalisation ou Délocalisation d'entreprise",
	},
	{ value: "investir", label: "Investir" },
	{ value: "demander-un-conseil", label: "Demander un conseil" },
	{ value: "autre", label: "Autre ..." },
] as const;

export const FORM_MESSAGES = {
	success:
		"Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.",
	error: "Une erreur est survenue. Veuillez réessayer plus tard.",
	required: "Ce champ est requis",
	invalidEmail: "Veuillez entrer une adresse email valide",
	invalidPhone: "Veuillez entrer un numéro de téléphone valide",
	consentRequired: "Vous devez accepter la politique de confidentialité",
} as const;
