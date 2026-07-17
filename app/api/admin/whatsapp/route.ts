import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";
import { logError } from "@/lib/errorTracking";
import { normalizeInbound } from "@/lib/whatsapp/adapters";
import { analyzeMessage } from "@/lib/whatsapp/analyze";
import { enqueue, list, setStatus } from "@/lib/whatsapp/queue";
import type { WhatsappQueueStatus } from "@/lib/whatsapp/types";

/**
 * Admin-facing API for the WhatsApp review queue.
 *
 * GET  → the current queue (the admin page polls this).
 * POST → either resolve an item ({ id, status: "approved" | "dismissed" }) or
 *        simulate an inbound message ({ action: "simulate", text, ... }). Approval
 *        is applied to the CRM store client-side; the resolve call only records
 *        that the item has left the pending state.
 *
 * Simulation runs the real ingestion path (normalise → analyse → enqueue) so the
 * flow is demonstrable without a connected provider. It is session-gated, so it
 * needs no webhook secret (that secret is server-only and never sent to the
 * browser).
 *
 * The `/admin` area is already gated by `middleware.ts`; the session cookie is
 * re-verified here for defense in depth (these API routes are not under the
 * middleware matcher).
 */

async function requireSession(request: NextRequest): Promise<boolean> {
	const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
	return isValidSession(token);
}

export async function GET(request: NextRequest) {
	if (!(await requireSession(request))) {
		return NextResponse.json(
			{ ok: false, error: "Unauthorized" },
			{ status: 401 },
		);
	}
	return NextResponse.json({ ok: true, items: list() });
}

export async function POST(request: NextRequest) {
	if (!(await requireSession(request))) {
		return NextResponse.json(
			{ ok: false, error: "Unauthorized" },
			{ status: 401 },
		);
	}

	try {
		const body = (await request.json()) as {
			action?: string;
			id?: string;
			status?: WhatsappQueueStatus;
			text?: string;
			groupName?: string;
			senderName?: string;
			senderPhone?: string;
		};

		// Simulate an inbound message through the real ingestion path.
		if (body.action === "simulate") {
			const message = normalizeInbound("generic", {
				groupId: "sim-group",
				groupName: body.groupName ?? "Collabimmo · Prospection",
				senderName: body.senderName ?? "Jamie",
				senderPhone: body.senderPhone ?? "+32 470 00 00 00",
				text: body.text ?? "",
			});
			if (!message) {
				return NextResponse.json(
					{ ok: false, error: "Message text is required" },
					{ status: 400 },
				);
			}
			const analysis = await analyzeMessage(message);
			const item = enqueue(message, analysis, new Date().toISOString());
			return NextResponse.json({ ok: true, item });
		}

		if (
			!body.id ||
			(body.status !== "approved" && body.status !== "dismissed")
		) {
			return NextResponse.json(
				{ ok: false, error: "Expected { id, status: approved | dismissed }" },
				{ status: 400 },
			);
		}

		const updated = setStatus(body.id, body.status);
		if (!updated) {
			return NextResponse.json(
				{ ok: false, error: "Item not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ ok: true, item: updated });
	} catch (error) {
		logError(error instanceof Error ? error : new Error("Unknown error"), {
			endpoint: "/api/admin/whatsapp",
			method: "POST",
		});
		return NextResponse.json(
			{ ok: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
