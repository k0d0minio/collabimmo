"use client";

import { Mail, Phone, Plus } from "lucide-react";
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
	CONTACT_TYPE_LABELS,
	formatCompactCurrency,
	formatRelative,
} from "@/lib/admin/format";
import { useCrm } from "@/lib/admin/store";
import type { ContactType } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const TYPE_TONE: Record<
	ContactType,
	"blue" | "green" | "amber" | "violet" | "slate"
> = {
	investor: "blue",
	tenant: "green",
	owner: "amber",
	partner: "violet",
	notary: "slate",
};

const TYPE_OPTIONS: (ContactType | "all")[] = [
	"all",
	"investor",
	"tenant",
	"owner",
	"partner",
	"notary",
];

export default function ContactsPage() {
	const { contacts } = useCrm();
	const [typeFilter, setTypeFilter] = useState<ContactType | "all">("all");

	const filtered = useMemo(
		() =>
			typeFilter === "all"
				? contacts
				: contacts.filter((contact) => contact.type === typeFilter),
		[contacts, typeFilter],
	);

	const investorValue = contacts.reduce(
		(sum, contact) => sum + (contact.portfolioValue ?? 0),
		0,
	);

	return (
		<>
			<PageHeader
				title="Contacts"
				description={`${contacts.length} contacts · ${formatCompactCurrency(investorValue)} de patrimoine sous relation`}
				action={
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						<Plus className="h-4 w-4" aria-hidden="true" />
						Nouveau contact
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
						{type === "all" ? "Tous" : CONTACT_TYPE_LABELS[type]}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{filtered.map((contact) => (
					<Card key={contact.id} className="p-5">
						<div className="flex items-start gap-3">
							<Avatar
								initials={initialsOf(contact.name)}
								color={stringToColor(contact.company)}
							/>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-slate-900">
									{contact.name}
								</p>
								<p className="truncate text-xs text-slate-500">
									{contact.role} · {contact.company}
								</p>
							</div>
							<Badge tone={TYPE_TONE[contact.type]}>
								{CONTACT_TYPE_LABELS[contact.type]}
							</Badge>
						</div>

						<div className="mt-4 space-y-1.5 text-sm">
							<a
								href={`mailto:${contact.email}`}
								className="flex items-center gap-2 text-slate-600 hover:text-primary"
							>
								<Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
								<span className="truncate">{contact.email}</span>
							</a>
							<a
								href={`tel:${contact.phone}`}
								className="flex items-center gap-2 text-slate-600 hover:text-primary"
							>
								<Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
								{contact.phone}
							</a>
						</div>

						<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
							<span className="text-slate-400">
								Contact {formatRelative(contact.lastContactAt)}
							</span>
							{contact.portfolioValue ? (
								<span className="font-medium text-slate-600">
									{formatCompactCurrency(contact.portfolioValue)}
								</span>
							) : (
								<span className="text-slate-400">{contact.city}</span>
							)}
						</div>
					</Card>
				))}
			</div>
		</>
	);
}
