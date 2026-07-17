"use client";

import {
	BarChart3,
	Building2,
	CalendarDays,
	Columns3,
	Contact as ContactIcon,
	Inbox,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageCircle,
	Search,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useCrm } from "@/lib/admin/store";
import { cn } from "@/lib/utils";

type NavItem = {
	href: string;
	label: string;
	icon: typeof LayoutDashboard;
};

const NAV_ITEMS: NavItem[] = [
	{ href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
	{ href: "/admin/inbox", label: "Boîte de réception", icon: Inbox },
	{ href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
	{ href: "/admin/leads", label: "Leads", icon: Users },
	{ href: "/admin/deals", label: "Pipeline", icon: Columns3 },
	{ href: "/admin/properties", label: "Portefeuille", icon: Building2 },
	{ href: "/admin/contacts", label: "Contacts", icon: ContactIcon },
	{ href: "/admin/calendar", label: "Agenda", icon: CalendarDays },
	{ href: "/admin/reports", label: "Rapports", icon: BarChart3 },
];

function isActive(pathname: string, href: string): boolean {
	if (href === "/admin") {
		return pathname === "/admin";
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const { messages } = useCrm();
	const unread = messages.filter((message) => !message.read).length;

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-2.5 px-5 py-5">
				<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
					C
				</span>
				<div className="leading-tight">
					<p className="text-sm font-semibold text-white">Collabimmo</p>
					<p className="text-[11px] text-slate-400">CRM · Démo</p>
				</div>
			</div>

			<nav className="flex-1 space-y-1 px-3 py-2" aria-label="Navigation admin">
				{NAV_ITEMS.map((item) => {
					const active = isActive(pathname, item.href);
					const Icon = item.icon;
					const showBadge = item.href === "/admin/inbox" && unread > 0;
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavigate}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								active
									? "bg-primary text-primary-foreground"
									: "text-slate-300 hover:bg-slate-800 hover:text-white",
							)}
						>
							<Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
							<span className="flex-1">{item.label}</span>
							{showBadge ? (
								<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
									{unread}
								</span>
							) : null}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-slate-800 px-5 py-4">
				<p className="text-[11px] leading-relaxed text-slate-500">
					Données fictives à des fins de démonstration. Aucune connexion aux
					données clients.
				</p>
			</div>
		</div>
	);
}

function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
	const router = useRouter();
	const { team } = useCrm();
	const [loggingOut, setLoggingOut] = useState(false);
	const current = team[0];

	async function handleLogout() {
		setLoggingOut(true);
		try {
			await fetch("/api/admin/logout", { method: "POST" });
		} finally {
			router.replace("/admin/login");
		}
	}

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-6">
			<button
				type="button"
				onClick={onOpenMenu}
				className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
				aria-label="Ouvrir le menu"
			>
				<Menu className="h-5 w-5" aria-hidden="true" />
			</button>

			<div className="relative hidden max-w-sm flex-1 sm:block">
				<Search
					className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
					aria-hidden="true"
				/>
				<input
					type="search"
					placeholder="Rechercher un lead, un bien, un contact…"
					className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					aria-label="Rechercher"
				/>
			</div>

			<div className="ml-auto flex items-center gap-3">
				<div className="hidden text-right sm:block">
					<p className="text-sm font-medium text-slate-900">{current?.name}</p>
					<p className="text-xs text-slate-500">{current?.role}</p>
				</div>
				<span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
					{current?.initials}
				</span>
				<button
					type="button"
					onClick={handleLogout}
					disabled={loggingOut}
					className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
					aria-label="Se déconnecter"
				>
					<LogOut className="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
		</header>
	);
}

export function AdminShell({ children }: { children: ReactNode }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-slate-50">
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-slate-900 lg:block">
				<SidebarContent />
			</aside>

			{menuOpen ? (
				<div className="fixed inset-0 z-50 lg:hidden">
					<button
						type="button"
						className="absolute inset-0 bg-slate-900/60"
						onClick={() => setMenuOpen(false)}
						aria-label="Fermer le menu"
					/>
					<aside className="absolute inset-y-0 left-0 w-64 bg-slate-900">
						<button
							type="button"
							onClick={() => setMenuOpen(false)}
							className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
							aria-label="Fermer le menu"
						>
							<X className="h-5 w-5" aria-hidden="true" />
						</button>
						<SidebarContent onNavigate={() => setMenuOpen(false)} />
					</aside>
				</div>
			) : null}

			<div className="lg:pl-64">
				<Topbar onOpenMenu={() => setMenuOpen(true)} />
				<main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
			</div>
		</div>
	);
}
