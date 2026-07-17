/**
 * Provider adapters: normalise a webhook payload into a WhatsappInboundMessage.
 *
 * WhatsApp group messages cannot be received through Meta's standard Cloud API
 * for a small business (group support is gated to very high-volume accounts), so
 * the practical route is a third-party provider (Whapi, Wassenger, …) that links
 * a WhatsApp number and forwards group messages to a webhook. Each provider has
 * its own payload shape. To stay provider-agnostic, the webhook route delegates
 * to `normalizeInbound(provider, body)`; adding a real provider later means
 * adding one adapter function here — nothing downstream changes.
 *
 * The `generic` adapter below documents the canonical shape our webhook accepts
 * out of the box, and backs the in-app "simulate message" affordance.
 */

import type { WhatsappInboundMessage } from "./types";

/** The canonical JSON shape our webhook accepts from the `generic` provider. */
export type GenericInboundPayload = {
	id?: string;
	groupId?: string;
	groupName?: string;
	senderName?: string;
	senderPhone?: string;
	text?: string;
	timestamp?: string;
};

function asString(value: unknown): string {
	return typeof value === "string" ? value : "";
}

/**
 * Normalise the `generic` payload. Returns null when the payload is missing the
 * minimum required fields (a group id and some text), so the caller can reject
 * it with a 400 rather than enqueue an empty message.
 */
function normalizeGeneric(body: unknown): WhatsappInboundMessage | null {
	if (typeof body !== "object" || body === null) {
		return null;
	}

	const payload = body as GenericInboundPayload;
	const groupId = asString(payload.groupId);
	const text = asString(payload.text);

	if (!groupId || !text.trim()) {
		return null;
	}

	return {
		id: asString(payload.id) || `wa-${groupId}-${text.length}-${Date.now()}`,
		groupId,
		groupName: asString(payload.groupName) || "Groupe WhatsApp",
		senderName: asString(payload.senderName) || "Inconnu",
		senderPhone: asString(payload.senderPhone),
		text: text.trim(),
		timestamp: asString(payload.timestamp) || new Date().toISOString(),
		provider: "generic",
		raw: body,
	};
}

/**
 * Map a provider-specific webhook body into our normalised message. Unknown
 * providers fall through to the generic adapter.
 */
export function normalizeInbound(
	provider: string,
	body: unknown,
): WhatsappInboundMessage | null {
	switch (provider) {
		// Add real providers here, e.g.:
		// case "whapi": return normalizeWhapi(body);
		// case "wassenger": return normalizeWassenger(body);
		default:
			return normalizeGeneric(body);
	}
}
