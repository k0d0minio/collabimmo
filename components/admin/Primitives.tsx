import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"rounded-xl border border-slate-200 bg-white shadow-sm",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	title,
	subtitle,
	action,
}: {
	title: string;
	subtitle?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
			<div>
				<h2 className="text-sm font-semibold text-slate-900">{title}</h2>
				{subtitle ? (
					<p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
				) : null}
			</div>
			{action}
		</div>
	);
}

export function PageHeader({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
					{title}
				</h1>
				{description ? (
					<p className="mt-1 text-sm text-slate-500">{description}</p>
				) : null}
			</div>
			{action}
		</div>
	);
}

type BadgeTone =
	| "slate"
	| "blue"
	| "violet"
	| "amber"
	| "orange"
	| "green"
	| "red";

const BADGE_TONES: Record<BadgeTone, string> = {
	slate: "bg-slate-100 text-slate-700",
	blue: "bg-blue-50 text-blue-700",
	violet: "bg-violet-50 text-violet-700",
	amber: "bg-amber-50 text-amber-700",
	orange: "bg-orange-50 text-orange-700",
	green: "bg-emerald-50 text-emerald-700",
	red: "bg-red-50 text-red-700",
};

export function Badge({
	children,
	tone = "slate",
	dot,
	className,
}: {
	children: ReactNode;
	tone?: BadgeTone;
	dot?: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
				BADGE_TONES[tone],
				className,
			)}
		>
			{dot ? (
				<span
					className="h-1.5 w-1.5 rounded-full"
					style={{ backgroundColor: dot }}
					aria-hidden="true"
				/>
			) : null}
			{children}
		</span>
	);
}

export function Avatar({
	initials,
	color = "#3a4fff",
	size = "md",
}: {
	initials: string;
	color?: string;
	size?: "sm" | "md";
}) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
				size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs",
			)}
			style={{ backgroundColor: color }}
			aria-hidden="true"
		>
			{initials}
		</span>
	);
}

export function StatCard({
	label,
	value,
	delta,
	deltaTone = "green",
	icon,
}: {
	label: string;
	value: string;
	delta?: string;
	deltaTone?: "green" | "red" | "slate";
	icon?: ReactNode;
}) {
	return (
		<Card className="p-5">
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
					{label}
				</p>
				{icon ? (
					<span className="text-slate-400" aria-hidden="true">
						{icon}
					</span>
				) : null}
			</div>
			<p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
				{value}
			</p>
			{delta ? (
				<p
					className={cn(
						"mt-1 text-xs font-medium",
						deltaTone === "green" && "text-emerald-600",
						deltaTone === "red" && "text-red-600",
						deltaTone === "slate" && "text-slate-500",
					)}
				>
					{delta}
				</p>
			) : null}
		</Card>
	);
}

export function stringToColor(input: string): string {
	const palette = [
		"#3a4fff",
		"#0ea5e9",
		"#8b5cf6",
		"#f59e0b",
		"#10b981",
		"#ef4444",
		"#f97316",
		"#64748b",
	];
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}
	return palette[Math.abs(hash) % palette.length];
}

export function initialsOf(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}
