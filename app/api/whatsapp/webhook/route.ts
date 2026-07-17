import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logError } from "@/lib/errorTracking";
import { normalizeInbound } from "@/lib/whatsapp/adapters";
import { analyzeMessage } from "@/lib/whatsapp/analyze";
import { enqueue } from "@/lib/whatsapp/queue";

/**
 * Inbound WhatsApp webhook.
 *
 * A third-party provider (Whapi, Wassenger, …) that mirrors a WhatsApp group
 * posts each new group message here. The message is normalised (provider-
 * agnostic), analysed by AI, and pushed onto the in-memory review queue for the
 * owner to approve in the admin section.
 *
 * Foundation phase: no provider is connected yet. The route is testable with a
 * simulated `generic` payload (see the admin WhatsApp page's "Simuler un
 * message" control, or a plain POST with the shared secret header).
 */

// Maximum request body size (16KB) — WhatsApp text messages are small.
const MAX_REQUEST_SIZE = 16 * 1024;

/** Constant-time-ish comparison to avoid leaking the secret via timing. */
function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

/**
 * Verify the shared-secret header. When no secret is configured the check is
 * skipped in development (mirrors the Turnstile dev-skip) but the request is
 * rejected in production so a misconfigured deployment fails closed.
 */
function isAuthorized(request: NextRequest): boolean {
	const configured = env.whatsapp.webhookSecret;
	if (!configured) {
		return env.isDevelopment();
	}
	const provided = request.headers.get("x-webhook-secret") ?? "";
	return safeEqual(provided, configured);
}

export async function POST(request: NextRequest) {
	try {
		if (!isAuthorized(request)) {
			return NextResponse.json(
				{ ok: false, error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const contentLength = request.headers.get("content-length");
		if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
			return NextResponse.json(
				{ ok: false, error: "Request too large" },
				{ status: 413 },
			);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json(
				{ ok: false, error: "Invalid JSON" },
				{ status: 400 },
			);
		}

		const provider =
			request.nextUrl.searchParams.get("provider") ??
			request.headers.get("x-provider") ??
			"generic";

		const message = normalizeInbound(provider, body);
		if (!message) {
			return NextResponse.json(
				{ ok: false, error: "Unrecognized or empty payload" },
				{ status: 400 },
			);
		}

		const analysis = await analyzeMessage(message);
		const item = enqueue(message, analysis, new Date().toISOString());

		return NextResponse.json({ ok: true, id: item.message.id }, { status: 200 });
	} catch (error) {
		logError(error instanceof Error ? error : new Error("Unknown error"), {
			endpoint: "/api/whatsapp/webhook",
			method: "POST",
		});
		return NextResponse.json(
			{ ok: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
