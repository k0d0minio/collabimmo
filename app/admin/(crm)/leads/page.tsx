"use client";

import { Mail, Phone, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Avatar,
	Badge,
	Card,
	initialsOf,
	PageHeader,
	stringToColor,
} from "@/components/admin/Primitives";
import {
	formatCurrency,
	formatRelative,
	PIPELINE_STAGES,
	PRIORITY_LABELS,
	PROPERTY_TYPE_LABELS,
	STAGE_ACCENT,
	STAGE_LABELS,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { LeadStage, Priority } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const PRIORITY_TONE: Record<Priority, "red" | "amber" | "slate"> = {
	high: "red",
	medium: "amber",
	low: "slate",
};

const ALL_STAGES: LeadStage[] = [...PIPELINE_STAGES, "lost"];

export default function LeadsPage() {
	const { leads, setLeadStage, updateLeadNotes } = useCrm();
	const [search, setSearch] = useState("");
	const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		return leads.filter((lead) => {
			if (stageFilter !== "all" && lead.stage !== stageFilter) {
				return false;
			}
			if (!query) {
				return true;
			}
			return (
				lead.name.toLowerCase().includes(query) ||
				lead.company.toLowerCase().includes(query) ||
				lead.location.toLowerCase().includes(query) ||
				lead.propertyInterest.toLowerCase().includes(query)
			);
		});
	}, [leads, search, stageFilter]);

	const selected = leads.find((lead) => lead.id === selectedId) ?? null;
	const totalValue = filtered.reduce((sum, lead) => sum + lead.value, 0);

	return (
		<>
			<PageHeader
				title="Leads"
				description={`${filtered.length} lead(s) · ${formatCurrency(totalValue)} de valeur cumulée`}
				action={
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						<Plus className="h-4 w-4" aria-hidden="true" />
						Nouveau lead
					</button>
				}
			/>

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative sm:max-w-xs sm:flex-1">
					<Search
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Rechercher…"
						className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						aria-label="Rechercher un lead"
					/>
				</div>
				<div className="flex flex-wrap gap-1.5">
					<FilterChip
						active={stageFilter === "all"}
						onClick={() => setStageFilter("all")}
					>
						Tous
					</FilterChip>
					{ALL_STAGES.map((stage) => (
						<FilterChip
							key={stage}
							active={stageFilter === stage}
							onClick={() => setStageFilter(stage)}
						>
							{STAGE_LABELS[stage]}
						</FilterChip>
					))}
				</div>
			</div>

			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[820px] text-sm">
						<thead>
							<tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
								<th className="px-5 py-3">Contact</th>
								<th className="px-5 py-3">Intérêt</th>
								<th className="px-5 py-3">Étape</th>
								<th className="px-5 py-3">Priorité</th>
								<th className="px-5 py-3 text-right">Valeur</th>
								<th className="px-5 py-3">Responsable</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filtered.map((lead) => (
								<tr
									key={lead.id}
									onClick={() => setSelectedId(lead.id)}
									className="cursor-pointer transition-colors hover:bg-slate-50"
								>
									<td className="px-5 py-3">
										<div className="flex items-center gap-3">
											<Avatar
												initials={initialsOf(lead.name)}
												color={stringToColor(lead.company)}
												size="sm"
											/>
											<div className="min-w-0">
												<p className="font-medium text-slate-800">
													{lead.name}
												</p>
												<p className="truncate text-xs text-slate-400">
													{lead.company}
												</p>
											</div>
										</div>
									</td>
									<td className="px-5 py-3">
										<p className="max-w-[220px] truncate text-slate-600">
											{lead.propertyInterest}
										</p>
										<p className="text-xs text-slate-400">
											{PROPERTY_TYPE_LABELS[lead.propertyType]} ·{" "}
											{lead.location}
										</p>
									</td>
									<td className="px-5 py-3">
										<select
											value={lead.stage}
											onClick={(event) => event.stopPropagation()}
											onChange={(event) => {
												event.stopPropagation();
												setLeadStage(lead.id, event.target.value as LeadStage);
											}}
											className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
											style={{ color: STAGE_ACCENT[lead.stage] }}
											aria-label={`Étape de ${lead.name}`}
										>
											{ALL_STAGES.map((stage) => (
												<option key={stage} value={stage}>
													{STAGE_LABELS[stage]}
												</option>
											))}
										</select>
									</td>
									<td className="px-5 py-3">
										<Badge tone={PRIORITY_TONE[lead.priority]}>
											{PRIORITY_LABELS[lead.priority]}
										</Badge>
									</td>
									<td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-900">
										{formatCurrency(lead.value)}
									</td>
									<td className="px-5 py-3 text-slate-500">{lead.owner}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 ? (
					<p className="px-5 py-10 text-center text-sm text-slate-400">
						Aucun lead ne correspond à votre recherche.
					</p>
				) : null}
			</Card>

			{selected ? (
				<LeadDrawer
					key={selected.id}
					lead={selected}
					onClose={() => setSelectedId(null)}
					onStageChange={(stage) => setLeadStage(selected.id, stage)}
					onNotesChange={(notes) => updateLeadNotes(selected.id, notes)}
				/>
			) : null}
		</>
	);
}

function FilterChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
				active
					? "bg-slate-900 text-white"
					: "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
			)}
		>
			{children}
		</button>
	);
}

type LeadDrawerProps = {
	lead: ReturnType<typeof useCrm>["leads"][number];
	onClose: () => void;
	onStageChange: (stage: LeadStage) => void;
	onNotesChange: (notes: string) => void;
};

function LeadDrawer({
	lead,
	onClose,
	onStageChange,
	onNotesChange,
}: LeadDrawerProps) {
	const [notes, setNotes] = useState(lead.notes);

	return (
		<div className="fixed inset-0 z-50">
			<button
				type="button"
				className="absolute inset-0 bg-slate-900/40"
				onClick={onClose}
				aria-label="Fermer"
			/>
			<aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
				<div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
					<div className="flex items-center gap-3">
						<Avatar
							initials={initialsOf(lead.name)}
							color={stringToColor(lead.company)}
						/>
						<div>
							<h2 className="text-lg font-semibold text-slate-900">
								{lead.name}
							</h2>
							<p className="text-sm text-slate-500">
								{lead.role} · {lead.company}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
						aria-label="Fermer le panneau"
					>
						<X className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>

				<div className="space-y-6 px-6 py-5">
					<div className="flex flex-wrap gap-2">
						{lead.tags.map((tag) => (
							<Badge key={tag} tone="violet">
								{tag}
							</Badge>
						))}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Field label="Valeur estimée" value={formatCurrency(lead.value)} />
						<Field label="Source" value={lead.source} />
						<Field
							label="Type de bien"
							value={PROPERTY_TYPE_LABELS[lead.propertyType]}
						/>
						<Field label="Localisation" value={lead.location} />
						<Field label="Priorité" value={PRIORITY_LABELS[lead.priority]} />
						<Field
							label="Dernière activité"
							value={formatRelative(lead.lastActivityAt)}
						/>
					</div>

					<div>
						<p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
							Intérêt
						</p>
						<p className="text-sm text-slate-700">{lead.propertyInterest}</p>
					</div>

					<div className="flex flex-wrap gap-2">
						<a
							href={`mailto:${lead.email}`}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
						>
							<Mail className="h-4 w-4" aria-hidden="true" />
							{lead.email}
						</a>
						<a
							href={`tel:${lead.phone}`}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
						>
							<Phone className="h-4 w-4" aria-hidden="true" />
							{lead.phone}
						</a>
					</div>

					<div>
						<label
							htmlFor="lead-stage"
							className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400"
						>
							Étape du pipeline
						</label>
						<select
							id="lead-stage"
							value={lead.stage}
							onChange={(event) =>
								onStageChange(event.target.value as LeadStage)
							}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							{ALL_STAGES.map((stage) => (
								<option key={stage} value={stage}>
									{STAGE_LABELS[stage]}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="lead-notes"
							className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400"
						>
							Notes
						</label>
						<textarea
							id="lead-notes"
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
							onBlur={() => onNotesChange(notes)}
							rows={4}
							className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						/>
					</div>
				</div>
			</aside>
		</div>
	);
}

function Field({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-medium uppercase tracking-wide text-slate-400">
				{label}
			</p>
			<p className="mt-0.5 text-sm font-medium text-slate-700">{value}</p>
		</div>
	);
}
