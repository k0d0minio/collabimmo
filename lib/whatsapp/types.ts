/**
 * WhatsApp integration domain types.
 *
 * These describe the foundation for ingesting WhatsApp *group* messages,
 * analysing them with AI, and proposing a CRM action for the business owner to
 * approve. They are intentionally kept separate from the core CRM types in
 * `lib/admin/types.ts` (which they reference) so the WhatsApp feature can evolve
 * without touching the demo CRM contract.
 */

import type {
	ContactType,
	Priority,
	PropertyType,
	TaskType,
} from "@/lib/admin/types";

/**
 * A normalised inbound WhatsApp message. Every third-party provider (Whapi,
 * Wassenger, …) or Meta's Cloud API has its own webhook payload shape; the
 * adapters in `lib/whatsapp/adapters.ts` map those shapes into this one so the
 * rest of the pipeline stays provider-agnostic.
 */
export type WhatsappInboundMessage = {
	id: string;
	/** Stable identifier of the WhatsApp group the message was posted in. */
	groupId: string;
	/** Human-readable group name (e.g. "Collabimmo · Prospection"). */
	groupName: string;
	/** Display name of the sender (usually the business owner). */
	senderName: string;
	/** Sender phone number in E.164 form, when the provider exposes it. */
	senderPhone: string;
	/** The message text content. */
	text: string;
	/** ISO-8601 timestamp of when the message was sent. */
	timestamp: string;
	/** Identifier of the provider that delivered the message (e.g. "generic"). */
	provider: string;
	/** The raw provider payload, retained for debugging. */
	raw?: unknown;
};

/**
 * The kinds of CRM action the AI can propose from a message. `none` covers
 * messages that need no action (chatter, acknowledgements, …).
 */
export type SuggestedActionType =
	| "create_lead"
	| "create_task"
	| "add_contact"
	| "add_property"
	| "log_note"
	| "none";

/**
 * Partial shapes of the CRM entities a suggested action can create. Fields are
 * optional because the AI only fills in what it can extract from the message;
 * the owner completes/edits the rest before approving.
 */
export type SuggestedLeadPayload = {
	name?: string;
	company?: string;
	phone?: string;
	email?: string;
	propertyInterest?: string;
	propertyType?: PropertyType;
	location?: string;
	priority?: Priority;
};

export type SuggestedTaskPayload = {
	title?: string;
	type?: TaskType;
	relatedName?: string;
};

export type SuggestedContactPayload = {
	name?: string;
	company?: string;
	phone?: string;
	email?: string;
	type?: ContactType;
	city?: string;
};

export type SuggestedPropertyPayload = {
	title?: string;
	type?: PropertyType;
	city?: string;
	price?: number;
	surface?: number;
	description?: string;
};

export type SuggestedNotePayload = {
	summary?: string;
};

export type SuggestedActionPayload =
	| SuggestedLeadPayload
	| SuggestedTaskPayload
	| SuggestedContactPayload
	| SuggestedPropertyPayload
	| SuggestedNotePayload;

/** A single AI-proposed action, with the reasoning behind it. */
export type SuggestedAction = {
	type: SuggestedActionType;
	payload: SuggestedActionPayload;
	reasoning: string;
};

/** The full AI analysis of a message. */
export type WhatsappAnalysis = {
	/** One-line summary of what the message is about. */
	summary: string;
	/** Short category label (e.g. "Nouveau lead", "Relance", "Information"). */
	category: string;
	/** Confidence in the suggested action, 0–1. */
	confidence: number;
	/** The action the owner is asked to approve. */
	suggestedAction: SuggestedAction;
	/** BCP-47 language tag detected in the message, when known. */
	language?: string;
	/** True when analysis was produced by the offline heuristic fallback. */
	usedFallback: boolean;
};

/** Status of an item in the review queue. */
export type WhatsappQueueStatus = "pending" | "approved" | "dismissed";

/** A message + its analysis, tracked through the owner's review workflow. */
export type WhatsappQueueItem = {
	message: WhatsappInboundMessage;
	analysis: WhatsappAnalysis;
	status: WhatsappQueueStatus;
	/** ISO-8601 timestamp of when the item entered the queue. */
	receivedAt: string;
};
