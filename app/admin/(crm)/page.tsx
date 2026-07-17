"use client";

import {
	ArrowUpRight,
	Building2,
	CheckCircle2,
	Circle,
	Euro,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import {
	Avatar,
	Badge,
	Card,
	CardHeader,
	PageHeader,
	StatCard,
} from "@/components/admin/Primitives";
import {
	formatCompactCurrency,
	formatCurrency,
	formatRelative,
	PIPELINE_STAGES,
	STAGE_ACCENT,
	STAGE_LABELS,
	TASK_TYPE_LABELS,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";

const OPEN_STAGES = new Set([
	"new",
	"contacted",
	"qualified",
	"proposal",
	"negotiation",
]);

export default function DashboardPage() {
	const { leads, tasks, activities, messages } = useCrm();

	const openLeads = leads.filter((lead) => OPEN_STAGES.has(lead.stage));
	const pipelineValue = openLeads.reduce((sum, lead) => sum + lead.value, 0);
	const wonLeads = leads.filter((lead) => lead.stage === "won");
	const wonValue = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
	const lostCount = leads.filter((lead) => lead.stage === "lost").length;
	const conversionRate =
		wonLeads.length + lostCount > 0
			? Math.round((wonLeads.length / (wonLeads.length + lostCount)) * 100)
			: 0;

	const stageCounts = PIPELINE_STAGES.map((stage) => ({
		stage,
		count: leads.filter((lead) => lead.stage === stage).length,
		value: leads
			.filter((lead) => lead.stage === stage)
			.reduce((sum, lead) => sum + lead.value, 0),
	}));
	const maxStageValue = Math.max(...stageCounts.map((entry) => entry.value), 1);

	const upcomingTasks = tasks
		.filter((task) => !task.completed)
		.sort((a, b) => a.dueAt.localeCompare(b.dueAt))
		.slice(0, 5);

	const topOpportunities = openLeads
		.slice()
		.sort((a, b) => b.value - a.value)
		.slice(0, 4);

	const unread = messages.filter((message) => !message.read).length;

	return (
		<>
			<PageHeader
				title="Tableau de bord"
				description="Vue d'ensemble de l'activité commerciale — semaine du 13 juillet 2026."
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Valeur du pipeline"
					value={formatCompactCurrency(pipelineValue)}
					delta="+12,4 % vs mois dernier"
					icon={<Euro className="h-5 w-5" />}
				/>
				<StatCard
					label="Leads actifs"
					value={String(openLeads.length)}
					delta={`${unread} message(s) non lu(s)`}
					deltaTone="slate"
					icon={<Users className="h-5 w-5" />}
				/>
				<StatCard
					label="Taux de conversion"
					value={`${conversionRate} %`}
					delta="Gagné vs perdu (clôturés)"
					deltaTone="slate"
					icon={<TrendingUp className="h-5 w-5" />}
				/>
				<StatCard
					label="CA signé (trim.)"
					value={formatCompactCurrency(wonValue)}
					delta={`${wonLeads.length} affaire(s) gagnée(s)`}
					icon={<CheckCircle2 className="h-5 w-5" />}
				/>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader
						title="Pipeline par étape"
						subtitle="Valeur cumulée des opportunités"
						action={
							<Link
								href="/admin/deals"
								className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
							>
								Voir le pipeline
								<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
							</Link>
						}
					/>
					<div className="space-y-4 p-5">
						{stageCounts.map((entry) => (
							<div key={entry.stage}>
								<div className="mb-1.5 flex items-center justify-between text-sm">
									<span className="flex items-center gap-2 font-medium text-slate-700">
										<span
											className="h-2.5 w-2.5 rounded-full"
											style={{ backgroundColor: STAGE_ACCENT[entry.stage] }}
											aria-hidden="true"
										/>
										{STAGE_LABELS[entry.stage]}
										<span className="text-xs font-normal text-slate-400">
											· {entry.count}
										</span>
									</span>
									<span className="tabular-nums text-slate-600">
										{formatCurrency(entry.value)}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-slate-100">
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
					<CardHeader title="Activité récente" />
					<ul className="divide-y divide-slate-100">
						{activities.slice(0, 6).map((activity) => (
							<li key={activity.id} className="flex gap-3 px-5 py-3">
								<Avatar initials={activity.actor.slice(0, 2)} size="sm" />
								<div className="min-w-0">
									<p className="text-sm text-slate-700">{activity.summary}</p>
									<p className="mt-0.5 text-xs text-slate-400">
										{activity.actor} · {formatRelative(activity.at)}
									</p>
								</div>
							</li>
						))}
					</ul>
				</Card>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader
						title="Tâches à venir"
						action={
							<Link
								href="/admin/calendar"
								className="text-xs font-medium text-primary hover:underline"
							>
								Agenda
							</Link>
						}
					/>
					<ul className="divide-y divide-slate-100">
						{upcomingTasks.map((task) => (
							<li key={task.id} className="flex items-center gap-3 px-5 py-3">
								<Circle
									className="h-4 w-4 shrink-0 text-slate-300"
									aria-hidden="true"
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-slate-700">
										{task.title}
									</p>
									<p className="text-xs text-slate-400">
										{task.owner}
										{task.relatedName ? ` · ${task.relatedName}` : ""}
									</p>
								</div>
								<Badge tone="slate">{TASK_TYPE_LABELS[task.type]}</Badge>
							</li>
						))}
					</ul>
				</Card>

				<Card>
					<CardHeader
						title="Meilleures opportunités"
						subtitle="Opportunités ouvertes par valeur"
						action={
							<Link
								href="/admin/leads"
								className="text-xs font-medium text-primary hover:underline"
							>
								Tous les leads
							</Link>
						}
					/>
					<ul className="divide-y divide-slate-100">
						{topOpportunities.map((lead) => (
							<li key={lead.id} className="flex items-center gap-3 px-5 py-3">
								<span
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
									aria-hidden="true"
								>
									<Building2 className="h-4 w-4" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-slate-800">
										{lead.company}
									</p>
									<p className="truncate text-xs text-slate-400">
										{lead.name} · {lead.location}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold tabular-nums text-slate-900">
										{formatCompactCurrency(lead.value)}
									</p>
									<Badge tone="slate" dot={STAGE_ACCENT[lead.stage]}>
										{STAGE_LABELS[lead.stage]}
									</Badge>
								</div>
							</li>
						))}
					</ul>
				</Card>
			</div>
		</>
	);
}
