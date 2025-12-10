/**
 * Environment variable validation and access utilities
 * Uses lazy evaluation to ensure env vars are loaded when accessed
 */

/**
 * Get a required environment variable, throwing an error if not set
 * Uses lazy evaluation - only checks when accessed, not at module load time
 */
function getRequiredEnv(key: string): () => string {
	return () => {
		const value = process.env[key];
		if (!value || value.trim() === "") {
			// Provide helpful debugging info
			const availableKeys = Object.keys(process.env)
				.filter(
					(k) =>
						k.includes("RESEND") ||
						k.includes("EMAIL") ||
						k.includes("TURNSTILE"),
				)
				.join(", ");
			throw new Error(
				`Missing required environment variable: ${key}\n` +
					`Please check your .env.local file.\n` +
					`Available related env vars: ${availableKeys || "none found"}\n` +
					`Current NODE_ENV: ${process.env.NODE_ENV || "not set"}`,
			);
		}
		return value;
	};
}

/**
 * Get an optional environment variable with a default value
 */
function getOptionalEnv(key: string, defaultValue: string): () => string {
	return () => process.env[key] || defaultValue;
}

/**
 * Get a public (client-side) environment variable
 * Note: NEXT_PUBLIC_ variables are embedded at BUILD TIME in Next.js
 * If the variable is set after building, you must rebuild the application
 */
function getPublicEnv(key: string, defaultValue?: string): () => string {
	return () => {
		// Access the environment variable directly
		// In Next.js, NEXT_PUBLIC_ vars are replaced at build time
		// Use bracket notation to ensure we get the value correctly
		const value =
			typeof process !== "undefined" && process.env
				? process.env[key]
				: undefined;

		// Trim whitespace if value exists
		const trimmedValue = value ? String(value).trim() : "";

		if (defaultValue !== undefined) {
			// If we have a default, use it only if the value is truly empty
			const result = trimmedValue || defaultValue;

			// Note: Missing public env vars should be caught at build time

			return result;
		}

		if (!trimmedValue) {
			// Note: Missing public env vars should be caught at build time
			return "";
		}

		return trimmedValue;
	};
}

/**
 * Server-side environment variables (private)
 * Uses getters for lazy evaluation - values are only checked when accessed
 */
export const env = {
	// Resend Email Service
	resend: {
		get apiKey() {
			return getRequiredEnv("RESEND_API_KEY")();
		},
		get fromEmail() {
			return getRequiredEnv("RESEND_FROM_EMAIL")();
		},
	},

	// Email recipient
	get emailTo() {
		return getRequiredEnv("EMAIL_TO")();
	},

	// Cloudflare Turnstile
	turnstile: {
		get secretKey() {
			return getRequiredEnv("TURNSTILE_SECRET_KEY")();
		},
		get verifyUrl() {
			return getOptionalEnv(
				"TURNSTILE_VERIFY_URL",
				"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			)();
		},
	},

	// Node environment
	get nodeEnv() {
		return getOptionalEnv("NODE_ENV", "development")();
	},

	// Utility functions
	isDevelopment: () => process.env.NODE_ENV === "development",
	isProduction: () => process.env.NODE_ENV === "production",
} as const;

/**
 * Client-side environment variables (public)
 * These are exposed to the browser via NEXT_PUBLIC_ prefix
 * Uses getters for lazy evaluation
 */
export const publicEnv = {
	// Cloudflare Turnstile
	turnstile: {
		get siteKey() {
			// Direct access to ensure Next.js build-time replacement works correctly
			// Next.js replaces NEXT_PUBLIC_* variables at build time, so direct property access is most reliable
			if (typeof process !== "undefined" && process.env) {
				const value = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
				if (value) {
					const trimmed = String(value).trim();
					if (trimmed) {
						return trimmed;
					}
				}
			}
			// Fallback: return empty string (will trigger warning in component)
			return "";
		},
	},

	// Site configuration
	site: {
		get url() {
			return getPublicEnv(
				"NEXT_PUBLIC_SITE_URL",
				"https://www.collabimmo.be",
			)();
		},
		get name() {
			return getPublicEnv("NEXT_PUBLIC_SITE_NAME", "Collabimmo")();
		},
	},

	// Company information (optional, with defaults)
	company: {
		get email() {
			return getPublicEnv("NEXT_PUBLIC_COMPANY_EMAIL", "info@collabimmo.be")();
		},
		get phone() {
			return getPublicEnv("NEXT_PUBLIC_COMPANY_PHONE", "+32 71 300 081")();
		},
		get address() {
			return getPublicEnv(
				"NEXT_PUBLIC_COMPANY_ADDRESS",
				"Rue de Namur 503 C, 6200 Châtelet",
			)();
		},
		get vat() {
			return getPublicEnv("NEXT_PUBLIC_COMPANY_VAT", "BE 0801.347.286")();
		},
		get ipi() {
			return getPublicEnv("NEXT_PUBLIC_COMPANY_IPI", "519569")();
		},
	},
} as const;

/**
 * Validate that all required environment variables are set
 * Call this at application startup to fail fast if configuration is missing
 * @throws Error if any required environment variables are missing
 */
export function validateEnv(): void {
	const missing: string[] = [];

	// Check server-side required env vars
	if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === "") {
		missing.push("RESEND_API_KEY");
	}
	if (
		!process.env.RESEND_FROM_EMAIL ||
		process.env.RESEND_FROM_EMAIL.trim() === ""
	) {
		missing.push("RESEND_FROM_EMAIL");
	}
	if (!process.env.EMAIL_TO || process.env.EMAIL_TO.trim() === "") {
		missing.push("EMAIL_TO");
	}
	if (
		!process.env.TURNSTILE_SECRET_KEY ||
		process.env.TURNSTILE_SECRET_KEY.trim() === ""
	) {
		missing.push("TURNSTILE_SECRET_KEY");
	}

	// Check client-side required env vars (only in production)
	if (process.env.NODE_ENV === "production") {
		if (
			!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
			process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.trim() === ""
		) {
			missing.push("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
		}
	}

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}\n` +
				`Please check your environment configuration. See .env.example for required variables.`,
		);
	}
}

/**
 * Debug helper to check environment variable status
 * Useful for troubleshooting env var issues
 */
export function debugEnv(): {
	resendApiKey: { exists: boolean; length: number };
	resendFromEmail: { exists: boolean; length: number };
	emailTo: { exists: boolean; length: number };
	turnstileSecretKey: { exists: boolean; length: number };
	allEnvKeys: string[];
} {
	const resendApiKey = process.env.RESEND_API_KEY || "";
	const resendFromEmail = process.env.RESEND_FROM_EMAIL || "";
	const emailTo = process.env.EMAIL_TO || "";
	const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY || "";

	return {
		resendApiKey: { exists: !!resendApiKey, length: resendApiKey.length },
		resendFromEmail: {
			exists: !!resendFromEmail,
			length: resendFromEmail.length,
		},
		emailTo: { exists: !!emailTo, length: emailTo.length },
		turnstileSecretKey: {
			exists: !!turnstileSecretKey,
			length: turnstileSecretKey.length,
		},
		allEnvKeys: Object.keys(process.env).filter(
			(k) =>
				k.includes("RESEND") || k.includes("EMAIL") || k.includes("TURNSTILE"),
		),
	};
}
