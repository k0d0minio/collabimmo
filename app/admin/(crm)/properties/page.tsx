"use client";

import { Building2, MapPin, Maximize, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card, PageHeader } from "@/components/admin/Primitives";
import {
	formatCurrency,
	PROPERTY_STATUS_LABELS,
	PROPERTY_TYPE_LABELS,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { PropertyStatus, PropertyType } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<
	PropertyStatus,
	"green" | "amber" | "slate" | "blue" | "violet"
> = {
	available: "green",
	under_offer: "amber",
	sold: "slate",
	rented: "blue",
	off_market: "violet",
};

const TYPE_OPTIONS: (PropertyType | "all")[] = [
	"all",
	"office",
	"retail",
	"warehouse",
	"industrial",
	"land",
	"mixed",
];

export default function PropertiesPage() {
	const { properties } = useCrm();
	const [typeFilter, setTypeFilter] = useState<PropertyType | "all">("all");

	const filtered = useMemo(
		() =>
			typeFilter === "all"
				? properties
				: properties.filter((property) => property.type === typeFilter),
		[properties, typeFilter],
	);

	const availableCount = properties.filter(
		(property) => property.status === "available",
	).length;
	const totalValue = properties
		.filter((property) => property.transaction === "sale")
		.reduce((sum, property) => sum + property.price, 0);

	return (
		<>
			<PageHeader
				title="Portefeuille de biens"
				description={`${properties.length} biens · ${availableCount} disponibles · ${formatCurrency(totalValue)} en portefeuille`}
				action={
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						<Plus className="h-4 w-4" aria-hidden="true" />
						Ajouter un bien
					</button>
				}
			/>

			<div className="mb-4 flex flex-wrap gap-1.5">
				{TYPE_OPTIONS.map((type) => (
					<button
						key={type}
						type="button"
						onClick={() => setTypeFilter(type)}
						className={cn(
							"rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
							typeFilter === type
								? "bg-slate-900 text-white"
								: "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
						)}
					>
						{type === "all" ? "Tous" : PROPERTY_TYPE_LABELS[type]}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
				{filtered.map((property) => (
					<Card key={property.id} className="flex flex-col overflow-hidden">
						<div
							className="relative flex h-28 items-center justify-center"
							style={{ backgroundColor: `${property.accent}14` }}
						>
							<Building2
								className="h-10 w-10"
								style={{ color: property.accent }}
								aria-hidden="true"
							/>
							<span className="absolute left-3 top-3">
								<Badge tone={STATUS_TONE[property.status]}>
									{PROPERTY_STATUS_LABELS[property.status]}
								</Badge>
							</span>
							<span className="absolute right-3 top-3 rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-500">
								{property.reference}
							</span>
						</div>

						<div className="flex flex-1 flex-col p-4">
							<div className="flex items-center gap-2">
								<Badge tone="slate">
									{PROPERTY_TYPE_LABELS[property.type]}
								</Badge>
								<span className="text-xs text-slate-400">
									{property.transaction === "rent" ? "Location" : "Vente"}
								</span>
							</div>
							<h3 className="mt-2 text-sm font-semibold text-slate-900">
								{property.title}
							</h3>
							<p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
								<MapPin className="h-3.5 w-3.5" aria-hidden="true" />
								{property.address}
							</p>
							<p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">
								{property.description}
							</p>

							<div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
								<div>
									<p className="text-lg font-semibold tabular-nums text-slate-900">
										{formatCurrency(property.price)}
										{property.transaction === "rent" ? (
											<span className="text-xs font-normal text-slate-400">
												/mois
											</span>
										) : null}
									</p>
								</div>
								<span className="flex items-center gap-1 text-xs text-slate-500">
									<Maximize className="h-3.5 w-3.5" aria-hidden="true" />
									{property.surface.toLocaleString("fr-BE")} m²
								</span>
							</div>
						</div>
					</Card>
				))}
			</div>
		</>
	);
}
