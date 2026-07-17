"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Avatar,
	Badge,
	initialsOf,
	PageHeader,
	stringToColor,
} from "@/components/admin/Primitives";
import {
	formatCompactCurrency,
	formatCurrency,
	PIPELINE_STAGES,
	PRIORITY_LABELS,
	STAGE_ACCENT,
	STAGE_LABELS,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { Lead, Priority } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const PRIORITY_TONE: Record<Priority, "red" | "amber" | "slate"> = {
	high: "red",
	medium: "amber",
	low: "slate",
};

export default function DealsPage() {
	const { leads, setLeadStage } = useCrm();

	const openValue = leads
		.filter((lead) => lead.stage !== "won" && lead.stage !== "lost")
		.reduce((sum, lead) => sum + lead.value, 0);

	function move(lead: Lead, direction: -1 | 1) {
		const index = PIPELINE_STAGES.indexOf(lead.stage);
		const nextIndex = index + direction;
		if (index === -1 || nextIndex < 0 || nextIndex >= PIPELINE_STAGES.length) {
			return;
		}
		setLeadStage(lead.id, PIPELINE_STAGES[nextIndex]);
	}

	return (
		<>
			<PageHeader
				title="Pipeline commercial"
				description={`${formatCurrency(openValue)} d'opportunités ouvertes · glissez les affaires d'une étape à l'autre.`}
			/>

			<div className="flex gap-4 overflow-x-auto pb-4">
				{PIPELINE_STAGES.map((stage) => {
					const columnLeads = leads.filter((lead) => lead.stage === stage);
					const columnValue = columnLeads.reduce(
						(sum, lead) => sum + lead.value,
						0,
					);
					return (
						<section
							key={stage}
							className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100/70"
						>
							<header className="flex items-center justify-between gap-2 px-3 py-3">
								<span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
									<span
										className="h-2.5 w-2.5 rounded-full"
										style={{ backgroundColor: STAGE_ACCENT[stage] }}
										aria-hidden="true"
									/>
									{STAGE_LABELS[stage]}
									<span className="rounded-full bg-white px-1.5 text-xs font-medium text-slate-500">
										{columnLeads.length}
									</span>
								</span>
								<span className="text-xs font-medium text-slate-400">
									{formatCompactCurrency(columnValue)}
								</span>
							</header>

							<div className="flex-1 space-y-2 px-2 pb-3">
								{columnLeads.map((lead) => {
									const index = PIPELINE_STAGES.indexOf(lead.stage);
									return (
										<article
											key={lead.id}
											className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
										>
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0">
													<p className="truncate text-sm font-semibold text-slate-800">
														{lead.company}
													</p>
													<p className="truncate text-xs text-slate-400">
														{lead.propertyInterest}
													</p>
												</div>
												<Badge tone={PRIORITY_TONE[lead.priority]}>
													{PRIORITY_LABELS[lead.priority]}
												</Badge>
											</div>

											<p className="mt-2 text-sm font-semibold tabular-nums text-slate-900">
												{formatCurrency(lead.value)}
											</p>

											<div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
												<span className="flex items-center gap-1.5 text-xs text-slate-500">
													<Avatar
														initials={initialsOf(lead.owner)}
														color={stringToColor(lead.owner)}
														size="sm"
													/>
													<span className="truncate">{lead.location}</span>
												</span>
												<span className="flex items-center gap-1">
													<button
														type="button"
														onClick={() => move(lead, -1)}
														disabled={index <= 0}
														className={cn(
															"rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700",
															index <= 0 && "invisible",
														)}
														aria-label={`Reculer ${lead.company}`}
													>
														<ChevronLeft
															className="h-4 w-4"
															aria-hidden="true"
														/>
													</button>
													<button
														type="button"
														onClick={() => move(lead, 1)}
														disabled={index >= PIPELINE_STAGES.length - 1}
														className={cn(
															"rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700",
															index >= PIPELINE_STAGES.length - 1 &&
																"invisible",
														)}
														aria-label={`Avancer ${lead.company}`}
													>
														<ChevronRight
															className="h-4 w-4"
															aria-hidden="true"
														/>
													</button>
												</span>
											</div>
										</article>
									);
								})}
								{columnLeads.length === 0 ? (
									<p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
										Aucune affaire
									</p>
								) : null}
							</div>
						</section>
					);
				})}
			</div>
		</>
	);
}
