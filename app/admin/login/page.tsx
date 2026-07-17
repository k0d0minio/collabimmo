"use client";

import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useState } from "react";

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setPending(true);
		try {
			const response = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			const data = (await response.json()) as {
				success: boolean;
				error?: string;
			};
			if (!response.ok || !data.success) {
				setError(data.error ?? "Connexion impossible.");
				setPending(false);
				return;
			}
			const next = searchParams.get("next");
			router.replace(next?.startsWith("/admin") ? next : "/admin");
		} catch {
			setError("Une erreur est survenue. Veuillez réessayer.");
			setPending(false);
		}
	}

	return (
		<div className="w-full max-w-sm">
			<div className="mb-8 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
					<Lock className="h-6 w-6" aria-hidden="true" />
				</div>
				<h1 className="text-2xl font-semibold tracking-tight text-white">
					Collabimmo CRM
				</h1>
				<p className="mt-1 text-sm text-slate-400">
					Espace réservé à l&apos;équipe. Veuillez vous authentifier.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur"
			>
				<div className="space-y-2">
					<label
						htmlFor="admin-password"
						className="text-sm font-medium text-slate-300"
					>
						Mot de passe administrateur
					</label>
					<input
						id="admin-password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						placeholder="••••••••••••"
						required
					/>
				</div>

				{error ? (
					<p
						className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400"
						role="alert"
					>
						{error}
					</p>
				) : null}

				<button
					type="submit"
					disabled={pending}
					className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-60"
				>
					{pending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
							Connexion…
						</>
					) : (
						"Se connecter"
					)}
				</button>
			</form>

			<p className="mt-6 text-center text-xs text-slate-500">
				Environnement de démonstration · données fictives
			</p>
		</div>
	);
}

export default function AdminLoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
			<Suspense fallback={null}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
