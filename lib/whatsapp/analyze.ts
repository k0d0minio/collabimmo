/**
 * AI analysis of an inbound WhatsApp message.
 *
 * `analyzeMessage` asks Claude to classify a real-estate WhatsApp message and
 * extract a proposed CRM action for the owner to approve. If no
 * ANTHROPIC_API_KEY is configured — or the API call fails — it gracefully falls
 * back to a deterministic keyword heuristic, mirroring how the contact route
 * skips Turnstile in development. This keeps the whole pipeline testable with no
 * key and no cost, while producing real analysis once a key is set.
 */

import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import { logError } from "@/lib/errorTracking";
import type {
	SuggestedAction,
	SuggestedActionType,
	WhatsappAnalysis,
	WhatsappInboundMessage,
} from "./types";

const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `Tu es l'assistant CRM de Collabimmo, une agence immobilière commerciale belge.
Tu analyses des messages postés par le dirigeant dans un groupe WhatsApp de prospection.
Pour chaque message, tu proposes UNE action CRM à valider par le dirigeant.

Types d'action possibles (champ "type") :
- "create_lead" : un prospect / acheteur / investisseur potentiel est mentionné.
- "create_task" : une action de suivi est demandée (rappel, relance, visite, rendez-vous, document).
- "add_contact" : un nouveau contact professionnel (partenaire, notaire, propriétaire) à enregistrer.
- "add_property" : un bien à vendre ou à louer est décrit.
- "log_note" : information générale sans action structurée.
- "none" : bavardage / accusé de réception, aucune action nécessaire.

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte autour, pas de bloc de code) de la forme :
{
  "summary": "résumé en une phrase (français)",
  "category": "étiquette courte (ex: Nouveau lead, Relance, Information)",
  "confidence": 0.0-1.0,
  "language": "code langue BCP-47 ou null",
  "suggestedAction": {
    "type": "create_lead | create_task | add_contact | add_property | log_note | none",
    "reasoning": "pourquoi cette action (français, une phrase)",
    "payload": {
      "name": null, "company": null, "phone": null, "email": null,
      "propertyInterest": null, "propertyType": null, "location": null, "priority": null,
      "title": null, "taskType": null, "contactType": null, "city": null,
      "price": null, "surface": null, "description": null, "relatedName": null
    }
  }
}
Contraintes de valeurs :
- propertyType ∈ office | retail | warehouse | industrial | land | mixed | null
- priority ∈ low | medium | high | null
- taskType ∈ call | email | meeting | viewing | follow_up | document | null
- contactType ∈ investor | tenant | owner | partner | notary | null
- price et surface sont des nombres ou null.
Ne remplis que les champs pertinents pour le type d'action choisi ; laisse les autres à null.`;

type RawPayload = Record<string, unknown>;

function str(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed === "" ? undefined : trimmed;
}

function num(value: unknown): number | undefined {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number(value.replace(/[^\d.]/g, ""));
		return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
	}
	return undefined;
}

function oneOf<T extends string>(
	value: unknown,
	allowed: readonly T[],
): T | undefined {
	return typeof value === "string" && allowed.includes(value as T)
		? (value as T)
		: undefined;
}

const ACTION_TYPES: readonly SuggestedActionType[] = [
	"create_lead",
	"create_task",
	"add_contact",
	"add_property",
	"log_note",
	"none",
];

/**
 * Convert the flat model payload into the typed `SuggestedAction.payload`,
 * keeping only the fields relevant to the chosen action type.
 */
function buildAction(type: SuggestedActionType, raw: RawPayload): SuggestedAction["payload"] {
	switch (type) {
		case "create_lead":
			return {
				name: str(raw.name),
				company: str(raw.company),
				phone: str(raw.phone),
				email: str(raw.email),
				propertyInterest: str(raw.propertyInterest),
				propertyType: oneOf(raw.propertyType, [
					"office",
					"retail",
					"warehouse",
					"industrial",
					"land",
					"mixed",
				]),
				location: str(raw.location),
				priority: oneOf(raw.priority, ["low", "medium", "high"]),
			};
		case "create_task":
			return {
				title: str(raw.title),
				type: oneOf(raw.taskType, [
					"call",
					"email",
					"meeting",
					"viewing",
					"follow_up",
					"document",
				]),
				relatedName: str(raw.relatedName),
			};
		case "add_contact":
			return {
				name: str(raw.name),
				company: str(raw.company),
				phone: str(raw.phone),
				email: str(raw.email),
				type: oneOf(raw.contactType, [
					"investor",
					"tenant",
					"owner",
					"partner",
					"notary",
				]),
				city: str(raw.city),
			};
		case "add_property":
			return {
				title: str(raw.title),
				type: oneOf(raw.propertyType, [
					"office",
					"retail",
					"warehouse",
					"industrial",
					"land",
					"mixed",
				]),
				city: str(raw.city),
				price: num(raw.price),
				surface: num(raw.surface),
				description: str(raw.description),
			};
		default:
			return { summary: str(raw.summary) };
	}
}

/** Extract the first balanced JSON object from a model response string. */
function extractJson(text: string): unknown {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start === -1 || end === -1 || end <= start) {
		throw new Error("No JSON object found in model response");
	}
	return JSON.parse(text.slice(start, end + 1));
}

/**
 * Deterministic offline analysis used when no API key is set or the API fails.
 * Keyword rules produce a reasonable suggested action so the flow is testable.
 */
export function heuristicAnalysis(
	message: WhatsappInboundMessage,
): WhatsappAnalysis {
	const text = message.text.toLowerCase();
	const has = (...words: string[]) => words.some((w) => text.includes(w));
	const phone = message.text.match(/(\+?\d[\d\s.\-]{7,}\d)/)?.[0]?.trim();

	let type: SuggestedActionType = "log_note";
	let category = "Information";
	let reasoning = "Message informatif sans action structurée détectée.";

	if (has("rappel", "rappeler", "relance", "rdv", "rendez-vous", "visite", "appeler")) {
		type = "create_task";
		category = "Suivi";
		reasoning = "Le message évoque une action de suivi à planifier.";
	} else if (has("à vendre", "a vendre", "à louer", "a louer", "mandat", "bien ", "m²", "immeuble", "entrepôt", "bureaux")) {
		type = "add_property";
		category = "Bien";
		reasoning = "Le message décrit un bien immobilier.";
	} else if (has("notaire", "partenaire", "propriétaire", "proprietaire")) {
		type = "add_contact";
		category = "Contact";
		reasoning = "Le message mentionne un contact professionnel à enregistrer.";
	} else if (has("intéressé", "interesse", "acheteur", "recherche", "prospect", "investisseur", "budget") || phone) {
		type = "create_lead";
		category = "Nouveau lead";
		reasoning = "Le message mentionne un prospect potentiel.";
	}

	const firstLine = message.text.split("\n")[0].trim();
	const summary = firstLine.length > 140 ? `${firstLine.slice(0, 137)}…` : firstLine;

	let payload: SuggestedAction["payload"];
	switch (type) {
		case "create_lead":
			payload = { phone, propertyInterest: summary, priority: "medium" };
			break;
		case "create_task":
			payload = { title: summary, type: "follow_up" };
			break;
		case "add_contact":
			payload = { phone, name: message.senderName };
			break;
		case "add_property":
			payload = { title: summary, description: message.text };
			break;
		default:
			payload = { summary };
			break;
	}

	return {
		summary: summary || "Message WhatsApp",
		category,
		confidence: 0.4,
		suggestedAction: { type, payload, reasoning },
		usedFallback: true,
	};
}

/**
 * Analyse a WhatsApp message with Claude, falling back to the heuristic when no
 * API key is configured or the call fails.
 */
export async function analyzeMessage(
	message: WhatsappInboundMessage,
): Promise<WhatsappAnalysis> {
	const apiKey = env.anthropic.apiKey;
	if (!apiKey || apiKey.trim() === "") {
		return heuristicAnalysis(message);
	}

	try {
		const client = new Anthropic({ apiKey });
		const response = await client.messages.create({
			model: MODEL,
			max_tokens: 1024,
			system: SYSTEM_PROMPT,
			messages: [
				{
					role: "user",
					content: `Groupe : ${message.groupName}\nExpéditeur : ${message.senderName}\nMessage :\n${message.text}`,
				},
			],
		});

		const textBlock = response.content.find((block) => block.type === "text");
		if (!textBlock || textBlock.type !== "text") {
			throw new Error("Model returned no text content");
		}

		const parsed = extractJson(textBlock.text) as Record<string, unknown>;
		const action =
			(parsed.suggestedAction as Record<string, unknown> | undefined) ?? {};
		const type = oneOf(action.type, ACTION_TYPES) ?? "log_note";
		const rawConfidence = num(parsed.confidence);
		const confidence =
			rawConfidence === undefined ? 0.5 : Math.min(1, Math.max(0, rawConfidence));

		return {
			summary: str(parsed.summary) ?? "Message WhatsApp",
			category: str(parsed.category) ?? "Information",
			confidence,
			language: str(parsed.language),
			suggestedAction: {
				type,
				payload: buildAction(type, (action.payload as RawPayload) ?? {}),
				reasoning: str(action.reasoning) ?? "",
			},
			usedFallback: false,
		};
	} catch (error) {
		logError(error instanceof Error ? error : new Error("WhatsApp analysis failed"), {
			service: "anthropic",
			messageId: message.id,
		});
		return heuristicAnalysis(message);
	}
}
