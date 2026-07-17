import type {
	ContactType,
	LeadStage,
	MessageChannel,
	Priority,
	PropertyStatus,
	PropertyType,
	TaskType,
} from "./types";

const NOW = new Date("2026-07-17T09:00:00Z");

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat("fr-BE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatCompactCurrency(value: number): string {
	return new Intl.NumberFormat("fr-BE", {
		style: "currency",
		currency: "EUR",
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatNumber(value: number): string {
	return new Intl.NumberFormat("fr-BE").format(value);
}

export function formatDate(iso: string): string {
	return new Intl.DateTimeFormat("fr-BE", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
	return new Intl.DateTimeFormat("fr-BE", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(iso));
}

export function formatTime(iso: string): string {
	return new Intl.DateTimeFormat("fr-BE", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(iso));
}

export function formatRelative(iso: string): string {
	const date = new Date(iso);
	const diffMs = date.getTime() - NOW.getTime();
	const diffMin = Math.round(diffMs / 60000);
	const abs = Math.abs(diffMin);
	const rtf = new Intl.RelativeTimeFormat("fr-BE", { numeric: "auto" });
	if (abs < 60) {
		return rtf.format(Math.round(diffMin), "minute");
	}
	if (abs < 60 * 24) {
		return rtf.format(Math.round(diffMin / 60), "hour");
	}
	if (abs < 60 * 24 * 30) {
		return rtf.format(Math.round(diffMin / (60 * 24)), "day");
	}
	return formatDate(iso);
}

export const STAGE_LABELS: Record<LeadStage, string> = {
	new: "Nouveau",
	contacted: "Contacté",
	qualified: "Qualifié",
	proposal: "Proposition",
	negotiation: "Négociation",
	won: "Gagné",
	lost: "Perdu",
};

export const PIPELINE_STAGES: LeadStage[] = [
	"new",
	"contacted",
	"qualified",
	"proposal",
	"negotiation",
	"won",
];

export const STAGE_ACCENT: Record<LeadStage, string> = {
	new: "#64748b",
	contacted: "#3b82f6",
	qualified: "#8b5cf6",
	proposal: "#f59e0b",
	negotiation: "#f97316",
	won: "#10b981",
	lost: "#ef4444",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
	office: "Bureaux",
	retail: "Commerce",
	warehouse: "Entrepôt",
	industrial: "Industriel",
	land: "Terrain",
	mixed: "Mixte",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
	available: "Disponible",
	under_offer: "Sous offre",
	sold: "Vendu",
	rented: "Loué",
	off_market: "Off-market",
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
	investor: "Investisseur",
	tenant: "Locataire",
	owner: "Propriétaire",
	partner: "Partenaire",
	notary: "Notaire",
};

export const CHANNEL_LABELS: Record<MessageChannel, string> = {
	email: "E-mail",
	form: "Formulaire",
	phone: "Téléphone",
	whatsapp: "WhatsApp",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
	call: "Appel",
	email: "E-mail",
	meeting: "Réunion",
	viewing: "Visite",
	follow_up: "Relance",
	document: "Document",
};
