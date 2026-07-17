"use client";

import {
	CheckCheck,
	Mail,
	MessageSquare,
	Phone,
	Reply,
	Star,
	UserRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, PageHeader } from "@/components/admin/Primitives";
import {
	CHANNEL_LABELS,
	formatDateTime,
	formatRelative,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { MessageChannel } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const CHANNEL_ICON: Record<MessageChannel, typeof Mail> = {
	email: Mail,
	form: MessageSquare,
	phone: Phone,
	whatsapp: MessageSquare,
};

type Filter = "all" | "unread" | "starred";

export default function InboxPage() {
	const {
		messages,
		leads,
		markMessageRead,
		toggleMessageStar,
		markAllMessagesRead,
	} = useCrm();
	const [filter, setFilter] = useState<Filter>("all");
	const [selectedId, setSelectedId] = useState<string>(messages[0]?.id ?? "");

	const filtered = useMemo(() => {
		const sorted = messages
			.slice()
			.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
		if (filter === "unread") {
			return sorted.filter((message) => !message.read);
		}
		if (filter === "starred") {
			return sorted.filter((message) => message.starred);
		}
		return sorted;
	}, [messages, filter]);

	const selected = messages.find((message) => message.id === selectedId);
	const relatedLead = selected?.leadId
		? leads.find((lead) => lead.id === selected.leadId)
		: undefined;
	const unreadCount = messages.filter((message) => !message.read).length;

	function selectMessage(id: string) {
		setSelectedId(id);
		markMessageRead(id, true);
	}

	const filters: { key: Filter; label: string }[] = [
		{ key: "all", label: "Tous" },
		{ key: "unread", label: `Non lus (${unreadCount})` },
		{ key: "starred", label: "Favoris" },
	];

	return (
		<>
			<PageHeader
				title="Boîte de réception"
				description="Demandes entrantes du site, e-mails et appels centralisés."
				action={
					<button
						type="button"
						onClick={markAllMessagesRead}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
					>
						<CheckCheck className="h-4 w-4" aria-hidden="true" />
						Tout marquer comme lu
					</button>
				}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
				<Card className="overflow-hidden">
					<div className="flex gap-1 border-b border-slate-100 p-2">
						{filters.map((entry) => (
							<button
								key={entry.key}
								type="button"
								onClick={() => setFilter(entry.key)}
								className={cn(
									"rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
									filter === entry.key
										? "bg-slate-900 text-white"
										: "text-slate-500 hover:bg-slate-100",
								)}
							>
								{entry.label}
							</button>
						))}
					</div>
					<ul className="max-h-[calc(100vh-16rem)] divide-y divide-slate-100 overflow-y-auto">
						{filtered.map((message) => {
							const Icon = CHANNEL_ICON[message.channel];
							const active = message.id === selectedId;
							return (
								<li key={message.id}>
									<button
										type="button"
										onClick={() => selectMessage(message.id)}
										className={cn(
											"flex w-full gap-3 px-4 py-3 text-left transition-colors",
											active ? "bg-primary/5" : "hover:bg-slate-50",
										)}
									>
										<span
											className={cn(
												"mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
												message.read
													? "bg-slate-100 text-slate-400"
													: "bg-primary/10 text-primary",
											)}
											aria-hidden="true"
										>
											<Icon className="h-4 w-4" />
										</span>
										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-2">
												<p
													className={cn(
														"truncate text-sm",
														message.read
															? "font-medium text-slate-600"
															: "font-semibold text-slate-900",
													)}
												>
													{message.fromName}
												</p>
												<span className="shrink-0 text-[11px] text-slate-400">
													{formatRelative(message.receivedAt)}
												</span>
											</div>
											<p
												className={cn(
													"truncate text-sm",
													message.read ? "text-slate-500" : "text-slate-800",
												)}
											>
												{message.subject}
											</p>
											<p className="truncate text-xs text-slate-400">
												{message.body.replace(/\n/g, " ")}
											</p>
										</div>
										{!message.read ? (
											<span
												className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
												role="img"
												aria-label="Non lu"
											/>
										) : null}
									</button>
								</li>
							);
						})}
						{filtered.length === 0 ? (
							<li className="px-4 py-10 text-center text-sm text-slate-400">
								Aucun message
							</li>
						) : null}
					</ul>
				</Card>

				<Card className="flex flex-col">
					{selected ? (
						<>
							<div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
								<div className="min-w-0">
									<div className="mb-2 flex flex-wrap items-center gap-2">
										<Badge tone="blue">
											{CHANNEL_LABELS[selected.channel]}
										</Badge>
										{selected.company ? (
											<span className="text-xs text-slate-400">
												{selected.company}
											</span>
										) : null}
									</div>
									<h2 className="text-lg font-semibold text-slate-900">
										{selected.subject}
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										<span className="font-medium text-slate-700">
											{selected.fromName}
										</span>{" "}
										· {selected.fromEmail}
									</p>
									<p className="mt-0.5 text-xs text-slate-400">
										{formatDateTime(selected.receivedAt)}
									</p>
								</div>
								<button
									type="button"
									onClick={() => toggleMessageStar(selected.id)}
									className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
									aria-label={
										selected.starred
											? "Retirer des favoris"
											: "Ajouter aux favoris"
									}
								>
									<Star
										className={cn(
											"h-5 w-5",
											selected.starred && "fill-amber-400 text-amber-400",
										)}
										aria-hidden="true"
									/>
								</button>
							</div>

							<div className="flex-1 px-6 py-5">
								<p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
									{selected.body}
								</p>

								{relatedLead ? (
									<div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
										<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
											Lead associé
										</p>
										<div className="mt-2 flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-slate-800">
													{relatedLead.name} · {relatedLead.company}
												</p>
												<p className="text-xs text-slate-500">
													{relatedLead.propertyInterest}
												</p>
											</div>
											<Link
												href="/admin/leads"
												className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
											>
												<UserRound className="h-3.5 w-3.5" aria-hidden="true" />
												Ouvrir
											</Link>
										</div>
									</div>
								) : null}
							</div>

							<div className="flex items-center gap-2 border-t border-slate-100 px-6 py-4">
								<button
									type="button"
									className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
								>
									<Reply className="h-4 w-4" aria-hidden="true" />
									Répondre
								</button>
								<button
									type="button"
									onClick={() => markMessageRead(selected.id, false)}
									className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
								>
									Marquer comme non lu
								</button>
							</div>
						</>
					) : (
						<div className="flex flex-1 items-center justify-center py-20 text-sm text-slate-400">
							Sélectionnez un message
						</div>
					)}
				</Card>
			</div>
		</>
	);
}
