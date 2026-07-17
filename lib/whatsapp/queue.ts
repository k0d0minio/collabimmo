/**
 * In-memory review queue for analysed WhatsApp messages.
 *
 * This mirrors the in-memory pattern already used by `lib/rateLimit.ts`: a
 * module-level store that lives for the lifetime of the server process. It is
 * deliberately simple so the WhatsApp foundation is testable end-to-end without
 * introducing a database yet.
 *
 * ⚠️ SWAP POINT — persistence: this queue resets on redeploy and is NOT shared
 * across serverless instances. When the feature graduates from "foundation" to
 * production, replace the body of these functions with reads/writes against a
 * real datastore (e.g. Supabase). The exported signatures are the contract the
 * rest of the app depends on; keep them stable.
 */

import type {
	WhatsappAnalysis,
	WhatsappInboundMessage,
	WhatsappQueueItem,
	WhatsappQueueStatus,
} from "./types";

/** Hard cap so a misbehaving provider cannot grow the queue unbounded. */
const MAX_QUEUE_SIZE = 200;

/** Newest-first list of queue items, keyed for de-duplication by message id. */
const items: WhatsappQueueItem[] = [];

/**
 * Add an analysed message to the queue. De-dupes by message id (a provider may
 * retry webhook delivery). Returns the created or existing item.
 */
export function enqueue(
	message: WhatsappInboundMessage,
	analysis: WhatsappAnalysis,
	receivedAt: string,
): WhatsappQueueItem {
	const existing = items.find((item) => item.message.id === message.id);
	if (existing) {
		return existing;
	}

	const item: WhatsappQueueItem = {
		message,
		analysis,
		status: "pending",
		receivedAt,
	};

	items.unshift(item);

	// Trim oldest resolved items first, then oldest overall, to stay bounded.
	if (items.length > MAX_QUEUE_SIZE) {
		items.length = MAX_QUEUE_SIZE;
	}

	return item;
}

/** Return a snapshot of the queue, newest first. */
export function list(): WhatsappQueueItem[] {
	return items.slice();
}

/** Look up a single queue item by its message id. */
export function getById(id: string): WhatsappQueueItem | undefined {
	return items.find((item) => item.message.id === id);
}

/**
 * Update the status of a queue item. Returns the updated item, or undefined if
 * no item matches the id.
 */
export function setStatus(
	id: string,
	status: WhatsappQueueStatus,
): WhatsappQueueItem | undefined {
	const item = items.find((entry) => entry.message.id === id);
	if (!item) {
		return undefined;
	}
	item.status = status;
	return item;
}
