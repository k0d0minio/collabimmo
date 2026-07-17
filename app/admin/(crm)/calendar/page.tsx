"use client";

import {
	CalendarDays,
	CheckCircle2,
	Circle,
	FileText,
	Mail,
	Phone,
	RotateCcw,
	Users,
} from "lucide-react";
import { useMemo } from "react";
import { Badge, Card, PageHeader } from "@/components/admin/Primitives";
import { formatTime, TASK_TYPE_LABELS } from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { CrmTask, TaskType } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const TASK_ICON: Record<TaskType, typeof Mail> = {
	call: Phone,
	email: Mail,
	meeting: Users,
	viewing: CalendarDays,
	follow_up: RotateCcw,
	document: FileText,
};

function dayKey(iso: string): string {
	return iso.slice(0, 10);
}

function dayLabel(iso: string): string {
	return new Intl.DateTimeFormat("fr-BE", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}).format(new Date(iso));
}

export default function CalendarPage() {
	const { tasks, toggleTask } = useCrm();

	const groups = useMemo(() => {
		const sorted = tasks.slice().sort((a, b) => a.dueAt.localeCompare(b.dueAt));
		const map = new Map<string, CrmTask[]>();
		for (const task of sorted) {
			const key = dayKey(task.dueAt);
			const list = map.get(key) ?? [];
			list.push(task);
			map.set(key, list);
		}
		return Array.from(map.entries());
	}, [tasks]);

	const pending = tasks.filter((task) => !task.completed).length;

	return (
		<>
			<PageHeader
				title="Agenda & tâches"
				description={`${pending} tâche(s) à traiter · rendez-vous, visites et relances de l'équipe.`}
			/>

			<div className="space-y-6">
				{groups.map(([key, dayTasks]) => (
					<div key={key}>
						<h2 className="mb-2 flex items-center gap-2 text-sm font-semibold capitalize text-slate-700">
							<CalendarDays
								className="h-4 w-4 text-slate-400"
								aria-hidden="true"
							/>
							{dayLabel(dayTasks[0].dueAt)}
							<span className="text-xs font-normal text-slate-400">
								· {dayTasks.length} tâche(s)
							</span>
						</h2>
						<Card className="divide-y divide-slate-100">
							{dayTasks.map((task) => {
								const Icon = TASK_ICON[task.type];
								return (
									<div
										key={task.id}
										className="flex items-center gap-3 px-5 py-3"
									>
										<button
											type="button"
											onClick={() => toggleTask(task.id)}
											className="shrink-0 text-slate-300 hover:text-primary"
											aria-label={
												task.completed
													? `Marquer « ${task.title} » comme à faire`
													: `Marquer « ${task.title} » comme terminée`
											}
										>
											{task.completed ? (
												<CheckCircle2
													className="h-5 w-5 text-emerald-500"
													aria-hidden="true"
												/>
											) : (
												<Circle className="h-5 w-5" aria-hidden="true" />
											)}
										</button>

										<span
											className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
											aria-hidden="true"
										>
											<Icon className="h-4 w-4" />
										</span>

										<div className="min-w-0 flex-1">
											<p
												className={cn(
													"truncate text-sm font-medium",
													task.completed
														? "text-slate-400 line-through"
														: "text-slate-800",
												)}
											>
												{task.title}
											</p>
											<p className="text-xs text-slate-400">
												{task.owner}
												{task.relatedName ? ` · ${task.relatedName}` : ""}
											</p>
										</div>

										<Badge tone="slate">{TASK_TYPE_LABELS[task.type]}</Badge>
										<span className="w-14 shrink-0 text-right text-xs tabular-nums text-slate-400">
											{formatTime(task.dueAt)}
										</span>
									</div>
								);
							})}
						</Card>
					</div>
				))}
			</div>
		</>
	);
}
