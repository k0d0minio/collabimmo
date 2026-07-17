"use client";

import { Check, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Card, PageHeader } from "@/components/admin/Primitives";
import { formatRelative } from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type {
	SuggestedActionType,
	WhatsappQueueItem,
} from "@/lib/whatsapp/types";
import { cn } from "@/lib/utils";

const ACTION_LABELS: Record<SuggestedActionType, string> = {
	create_lead: "Créer un lead",
	create_task: "Créer une tâche",
	add_contact: "Ajouter un contact",
	add_property: "Ajouter un bien",
	log_note: "Enregistrer une note",
	none: "Aucune action",
};

const FIELD_LABELS: Record<string, string> = {
	name: "Nom",
	company: "Société",
	phone: "Téléphone",
	email: "E-mail",
	propertyInterest: "Recherche",
	propertyType: "Type de bien",
	location: "Localisation",
	priority: "Priorité",
	title: "Titre",
	type: "Type",
	relatedName: "Lié à",
	city: "Ville",
	price: "Prix",
	surface: "Surface",
	description: "Description",
	summary: "Résumé",
};

const NUMERIC_FIELDS = new Set(["price", "surface"]);

type Drafts = Record<string, Record<string, string>>;

function payloadToDraft(payload: Record<string, unknown>): Record<string, string> {
	const draft: Record<string, string> = {};
	for (const [key, value] of Object.entries(payload)) {
		if (value !== undefined && value !== null) {
			draft[key] = String(value);
		}
	}
	return draft;
}

export default function WhatsappPage() {
	const { applySuggestedAction } = useCrm();
	const [items, setItems] = useState<WhatsappQueueItem[]>([]);
	const [drafts, setDrafts] = useState<Drafts>({});
	const [simText, setSimText] = useState("");
	const [busy, setBusy] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/whatsapp");
			if (!res.ok) return;
			const data = (await res.json()) as { items?: WhatsappQueueItem[] };
			setItems(data.items ?? []);
		} catch {
			// Network hiccup — the next poll will retry.
		}
	}, []);

	// Poll the server-side queue (the webhook enqueues out-of-band).
	useEffect(() => {
		refresh();
		const interval = setInterval(refresh, 5000);
		return () => clearInterval(interval);
	}, [refresh]);

	const pending = useMemo(
		() => items.filter((item) => item.status === "pending"),
		[items],
	);

	function initialDraft(id: string): Record<string, string> {
		const found = items.find((item) => item.message.id === id);
		return found
			? payloadToDraft(
					found.analysis.suggestedAction.payload as Record<string, unknown>,
				)
			: {};
	}

	function draftFor(item: WhatsappQueueItem): Record<string, string> {
		return (
			drafts[item.message.id] ??
			payloadToDraft(
				item.analysis.suggestedAction.payload as Record<string, unknown>,
			)
		);
	}

	function setField(id: string, key: string, value: string) {
		setDrafts((prev) => {
			const base = prev[id] ?? initialDraft(id);
			return { ...prev, [id]: { ...base, [key]: value } };
		});
	}

	async function resolve(id: string, status: "approved" | "dismissed") {
		await fetch("/api/admin/whatsapp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status }),
		});
		await refresh();
	}

	async function approve(item: WhatsappQueueItem) {
		const draft = draftFor(item);
		const payload: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(draft)) {
			if (value.trim() === "") continue;
			payload[key] = NUMERIC_FIELDS.has(key) ? Number(value) : value;
		}
		const edited: WhatsappQueueItem = {
			...item,
			analysis: {
				...item.analysis,
				suggestedAction: { ...item.analysis.suggestedAction, payload },
			},
		};
		applySuggestedAction(edited);
		await resolve(item.message.id, "approved");
	}

	async function simulate() {
		if (!simText.trim() || busy) return;
		setBusy(true);
		try {
			await fetch("/api/admin/whatsapp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "simulate", text: simText.trim() }),
			});
			setSimText("");
			await refresh();
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<PageHeader
				title="WhatsApp"
				description="Messages de groupe analysés par IA. Validez l'action proposée pour l'appliquer au CRM."
			/>

			<Card className="mb-6 p-5">
				<div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
					<Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
					Simuler un message (démo — aucun compte WhatsApp requis)
				</div>
				<div className="flex flex-col gap-2 sm:flex-row">
					<textarea
						value={simText}
						onChange={(event) => setSimText(event.target.value)}
						placeholder="Ex : Nouveau contact investisseur, cherche un immeuble de bureaux à Namur, budget 600k. Tel +32 470 12 34 56"
						rows={2}
						className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					/>
					<button
						type="button"
						onClick={simulate}
						disabled={busy || !simText.trim()}
						className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					>
						<Send className="h-4 w-4" aria-hidden="true" />
						Envoyer
					</button>
				</div>
			</Card>

			{pending.length === 0 ? (
				<Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
					<MessageCircle
						className="h-8 w-8 text-slate-300"
						aria-hidden="true"
					/>
					<p className="text-sm text-slate-500">
						Aucun message en attente de validation.
					</p>
				</Card>
			) : (
				<div className="space-y-4">
					{pending.map((item) => {
						const { message, analysis } = item;
						const action = analysis.suggestedAction;
						const draft = draftFor(item);
						const confidence = Math.round(analysis.confidence * 100);
						return (
							<Card key={message.id} className="p-5">
								<div className="flex flex-wrap items-center gap-2">
									<Badge tone="green" dot="#25D366">
										WhatsApp
									</Badge>
									<Badge tone="blue">{analysis.category}</Badge>
									{analysis.usedFallback ? (
										<Badge tone="amber">Analyse heuristique</Badge>
									) : (
										<Badge tone="violet">IA</Badge>
									)}
									<span className="text-xs text-slate-400">
										{message.groupName} · {message.senderName} ·{" "}
										{formatRelative(message.timestamp)}
									</span>
								</div>

								<p className="mt-3 whitespace-pre-line text-sm text-slate-700">
									{message.text}
								</p>

								<div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
									<div className="flex flex-wrap items-center justify-between gap-2">
										<p className="text-sm font-semibold text-slate-900">
											{ACTION_LABELS[action.type]}
										</p>
										<span
											className={cn(
												"text-xs font-medium",
												confidence >= 66
													? "text-emerald-600"
													: confidence >= 33
														? "text-amber-600"
														: "text-slate-500",
											)}
										>
											Confiance {confidence}%
										</span>
									</div>
									{analysis.summary ? (
										<p className="mt-1 text-xs text-slate-500">
											{analysis.summary}
										</p>
									) : null}
									{action.reasoning ? (
										<p className="mt-1 text-xs italic text-slate-400">
											{action.reasoning}
										</p>
									) : null}

									{action.type !== "none" &&
									Object.keys(draft).length > 0 ? (
										<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
											{Object.entries(draft).map(([key, value]) => (
												<label
													key={key}
													className="flex flex-col gap-1 text-xs"
												>
													<span className="font-medium text-slate-500">
														{FIELD_LABELS[key] ?? key}
													</span>
													<input
														value={value}
														onChange={(event) =>
															setField(message.id, key, event.target.value)
														}
														className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
													/>
												</label>
											))}
										</div>
									) : null}
								</div>

								<div className="mt-4 flex items-center gap-2">
									<button
										type="button"
										onClick={() => approve(item)}
										className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
									>
										<Check className="h-4 w-4" aria-hidden="true" />
										Valider
									</button>
									<button
										type="button"
										onClick={() => resolve(message.id, "dismissed")}
										className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
									>
										<X className="h-4 w-4" aria-hidden="true" />
										Ignorer
									</button>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
}
