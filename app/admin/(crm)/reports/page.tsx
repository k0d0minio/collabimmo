"use client";

import { useMemo } from "react";
import {
	Card,
	CardHeader,
	PageHeader,
	StatCard,
} from "@/components/admin/Primitives";
import {
	formatCompactCurrency,
	formatCurrency,
	PIPELINE_STAGES,
	PROPERTY_TYPE_LABELS,
	STAGE_ACCENT,
	STAGE_LABELS,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { PropertyType } from "@/lib/admin/types";

export default function ReportsPage() {
	const { leads, properties } = useCrm();

	const stageData = PIPELINE_STAGES.map((stage) => ({
		stage,
		value: leads
			.filter((lead) => lead.stage === stage)
			.reduce((sum, lead) => sum + lead.value, 0),
	}));
	const maxStageValue = Math.max(...stageData.map((entry) => entry.value), 1);

	const sourceData = useMemo(() => {
		const map = new Map<string, number>();
		for (const lead of leads) {
			map.set(lead.source, (map.get(lead.source) ?? 0) + 1);
		}
		return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
	}, [leads]);
	const maxSource = Math.max(...sourceData.map(([, count]) => count), 1);

	const typeData = useMemo(() => {
		const map = new Map<PropertyType, number>();
		for (const property of properties) {
			map.set(property.type, (map.get(property.type) ?? 0) + 1);
		}
		return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
	}, [properties]);

	const funnel = PIPELINE_STAGES.map((stage) => ({
		stage,
		count: leads.filter((lead) => lead.stage === stage).length,
	}));
	const funnelMax = Math.max(...funnel.map((entry) => entry.count), 1);

	const wonValue = leads
		.filter((lead) => lead.stage === "won")
		.reduce((sum, lead) => sum + lead.value, 0);
	const avgDeal =
		leads.length > 0
			? leads.reduce((sum, lead) => sum + lead.value, 0) / leads.length
			: 0;
	const winRate = (() => {
		const won = leads.filter((lead) => lead.stage === "won").length;
		const lost = leads.filter((lead) => lead.stage === "lost").length;
		return won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
	})();

	return (
		<>
			<PageHeader
				title="Rapports & analytics"
				description="Indicateurs de performance commerciale — période en cours."
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard label="CA signé" value={formatCompactCurrency(wonValue)} />
				<StatCard label="Ticket moyen" value={formatCompactCurrency(avgDeal)} />
				<StatCard label="Taux de succès" value={`${winRate} %`} />
				<StatCard label="Biens gérés" value={String(properties.length)} />
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader title="Valeur du pipeline par étape" />
					<div className="space-y-4 p-5">
						{stageData.map((entry) => (
							<div key={entry.stage}>
								<div className="mb-1 flex items-center justify-between text-sm">
									<span className="font-medium text-slate-600">
										{STAGE_LABELS[entry.stage]}
									</span>
									<span className="tabular-nums text-slate-500">
										{formatCurrency(entry.value)}
									</span>
								</div>
								<div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full rounded-full"
										style={{
											width: `${(entry.value / maxStageValue) * 100}%`,
											backgroundColor: STAGE_ACCENT[entry.stage],
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card>
					<CardHeader title="Leads par source" />
					<div className="space-y-4 p-5">
						{sourceData.map(([source, count]) => (
							<div key={source}>
								<div className="mb-1 flex items-center justify-between text-sm">
									<span className="font-medium text-slate-600">{source}</span>
									<span className="tabular-nums text-slate-500">{count}</span>
								</div>
								<div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full rounded-full bg-primary"
										style={{ width: `${(count / maxSource) * 100}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card>
					<CardHeader title="Entonnoir de conversion" />
					<div className="space-y-2 p-5">
						{funnel.map((entry) => (
							<div key={entry.stage} className="flex items-center gap-3">
								<span className="w-24 shrink-0 text-xs font-medium text-slate-500">
									{STAGE_LABELS[entry.stage]}
								</span>
								<div className="flex-1">
									<div
										className="flex h-7 items-center justify-end rounded-md px-2 text-xs font-semibold text-white"
										style={{
											width: `${Math.max((entry.count / funnelMax) * 100, 12)}%`,
											backgroundColor: STAGE_ACCENT[entry.stage],
										}}
									>
										{entry.count}
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card>
					<CardHeader title="Portefeuille par type de bien" />
					<div className="space-y-3 p-5">
						{typeData.map(([type, count]) => {
							const share = Math.round((count / properties.length) * 100);
							return (
								<div key={type}>
									<div className="mb-1 flex items-center justify-between text-sm">
										<span className="font-medium text-slate-600">
											{PROPERTY_TYPE_LABELS[type]}
										</span>
										<span className="tabular-nums text-slate-500">
											{count} · {share} %
										</span>
									</div>
									<div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
										<div
											className="h-full rounded-full bg-slate-700"
											style={{ width: `${share}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</Card>
			</div>
		</>
	);
}
