import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email";
import { env, validateEnv } from "@/lib/env";
import { logError } from "@/lib/errorTracking";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { validateContactForm } from "@/lib/validations";
import type {
	ApiResponse,
	ContactFormRequest,
	ContactFormResponse,
} from "@/types";

// Validate environment variables on module load (server-side only)
if (typeof window === "undefined") {
	try {
		validateEnv();
	} catch (error) {
		// Log error but don't crash - allows app to start and show error on first API call
		// eslint-disable-next-line no-console
		console.error(
			"[API] Environment validation failed:",
			error instanceof Error ? error.message : String(error),
		);
	}
}

// Maximum request body size (10KB)
const MAX_REQUEST_SIZE = 10 * 1024;

// Request timeout (30 seconds)
const REQUEST_TIMEOUT_MS = 30 * 1000;

// Rate limiting: 5 requests per 15 minutes per IP
const RATE_LIMIT_OPTIONS = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5,
};

// Helper function to get user-friendly field names
function getFieldDisplayName(field: string): string {
	const fieldNames: Record<string, string> = {
		firstname: "Prénom",
		name: "Nom",
		email: "Email",
		phone: "Téléphone",
		company: "Entreprise",
		vatNumber: "TVA",
		message: "Message",
		propertyType: "Type de bien",
		consent: "Consentement",
		turnstileToken: "Vérification CAPTCHA",
	};
	return fieldNames[field] || field;
}

async function validateTurnstileToken(token: string): Promise<boolean> {
	if (!token) {
		return false;
	}

	try {
		// Add timeout to fetch request
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10 * 1000); // 10 second timeout

		try {
			const response = await fetch(env.turnstile.verifyUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					secret: env.turnstile.secretKey,
					response: token,
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				return false;
			}

			const result = await response.json();
			return result.success === true;
		} catch (fetchError) {
			clearTimeout(timeoutId);
			if (fetchError instanceof Error && fetchError.name === "AbortError") {
				// Timeout occurred
				return false;
			}
			throw fetchError;
		}
	} catch (error) {
		// Silently fail in production, log in development
		if (env.isDevelopment()) {
			// eslint-disable-next-line no-console
			console.error("Turnstile validation error:", error);
		}
		return false;
	}
}

export async function POST(request: NextRequest) {
	// Set overall request timeout
	const timeoutPromise = new Promise<NextResponse>((resolve) => {
		setTimeout(() => {
			resolve(
				NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Request timeout",
						data: {
							success: false,
							message: "La requête a pris trop de temps. Veuillez réessayer.",
						},
					},
					{ status: 408 },
				),
			);
		}, REQUEST_TIMEOUT_MS);
	});

	const handlerPromise = (async () => {
		try {
			// Rate limiting check
			const clientId = getClientIdentifier(request);
			const rateLimitResult = checkRateLimit(clientId, RATE_LIMIT_OPTIONS);

			if (!rateLimitResult.allowed) {
				const resetDate = new Date(rateLimitResult.resetTime);
				return NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Rate limit exceeded",
						data: {
							success: false,
							message: `Trop de tentatives. Veuillez réessayer après ${resetDate.toLocaleTimeString("fr-FR")}.`,
						},
					},
					{
						status: 429,
						headers: {
							"X-RateLimit-Limit": String(RATE_LIMIT_OPTIONS.maxRequests),
							"X-RateLimit-Remaining": String(rateLimitResult.remaining),
							"X-RateLimit-Reset": String(rateLimitResult.resetTime),
							"Retry-After": String(
								Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
							),
						},
					},
				);
			}

			// Check request size
			const contentLength = request.headers.get("content-length");
			if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
				return NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Request too large",
						data: {
							success: false,
							message:
								"La requête est trop volumineuse. Veuillez réduire la taille de votre message.",
						},
					},
					{ status: 413 },
				);
			}

			// Parse request body with error handling
			let body: ContactFormRequest;
			try {
				body = await request.json();
			} catch (_error) {
				return NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Invalid JSON",
						data: {
							success: false,
							message: "Format de requête invalide.",
						},
					},
					{ status: 400 },
				);
			}

			// Validate Turnstile token (skip in development)
			const skipTurnstileValidation = env.isDevelopment();

			if (!skipTurnstileValidation) {
				if (!body.turnstileToken) {
					return NextResponse.json<ApiResponse<ContactFormResponse>>(
						{
							success: false,
							error: "CAPTCHA validation failed",
							message: "Veuillez compléter la vérification CAPTCHA",
							data: {
								success: false,
								message: "Veuillez compléter la vérification CAPTCHA",
							},
						},
						{ status: 400 },
					);
				}

				const isTokenValid = await validateTurnstileToken(body.turnstileToken);

				if (!isTokenValid) {
					const errorDetails = env.isDevelopment()
						? "Turnstile token validation failed. Check your secret key and token."
						: "La vérification CAPTCHA a échoué. Veuillez réessayer.";

					return NextResponse.json<ApiResponse<ContactFormResponse>>(
						{
							success: false,
							error: "CAPTCHA validation failed",
							message: errorDetails,
							data: {
								success: false,
								message:
									"La vérification CAPTCHA a échoué. Veuillez réessayer.",
							},
						},
						{ status: 400 },
					);
				}
			}

			// Validate and sanitize form data
			const formData = {
				firstname: sanitizeText(body.firstname),
				name: sanitizeText(body.name),
				email: sanitizeEmail(body.email),
				phone: sanitizeText(body.phone),
				company: sanitizeText(body.company),
				vatNumber: sanitizeText(body.vatNumber),
				message: sanitizeText(body.message),
				propertyType: sanitizeText(body.propertyType),
				consent: body.consent ?? false, // Use actual consent value from request
				turnstileToken: body.turnstileToken || "",
			};

			const errors = validateContactForm(formData, skipTurnstileValidation);

			if (Object.keys(errors).length > 0) {
				// Create detailed error message listing all validation errors
				const errorFields = Object.keys(errors);
				const _errorMessages = errorFields.map((field) => {
					const fieldName = getFieldDisplayName(field);
					return `${fieldName}: ${errors[field as keyof typeof errors]}`;
				});

				const detailedMessage = `Veuillez corriger les erreurs suivantes: ${errorFields.map((f) => getFieldDisplayName(f)).join(", ")}`;

				return NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Validation failed",
						message: detailedMessage,
						validationErrors: errors as Record<string, string>,
						data: {
							success: false,
							message: "Veuillez corriger les erreurs du formulaire",
							validationErrors: errors as Record<string, string>,
						},
					},
					{ status: 400 },
				);
			}

			const resend = new Resend(env.resend.apiKey);

			// Add timeout to email sending
			const emailPromise = resend.emails.send({
				from: env.resend.fromEmail,
				to: [env.emailTo],
				replyTo: formData.email,
				subject: `Nouveau message de contact - ${formData.firstname} ${formData.name}`,
				react: EmailTemplate({
					firstname: formData.firstname,
					name: formData.name,
					email: formData.email,
					phone: formData.phone || undefined,
					company: formData.company || undefined,
					vatNumber: formData.vatNumber || undefined,
					propertyType: formData.propertyType || undefined,
					message: formData.message,
				}),
			});

			const emailTimeoutPromise = new Promise<{
				data: null;
				error: { message: string };
			}>((resolve) => {
				setTimeout(() => {
					resolve({
						data: null,
						error: { message: "Email sending timeout" },
					});
				}, 20 * 1000); // 20 second timeout for email
			});

			const { error } = await Promise.race([emailPromise, emailTimeoutPromise]);

			if (error) {
				// Log error (captured by Vercel logs)
				logError(
					error instanceof Error ? error : new Error("Email sending failed"),
					{
						service: "resend",
						formData: {
							email: formData.email,
							firstname: formData.firstname,
							name: formData.name,
						},
					},
				);

				return NextResponse.json<ApiResponse<ContactFormResponse>>(
					{
						success: false,
						error: "Failed to send email",
						message: "Une erreur est survenue lors de l'envoi du formulaire",
						data: {
							success: false,
							message: "Une erreur est survenue lors de l'envoi du formulaire",
						},
					},
					{ status: 500 },
				);
			}

			return NextResponse.json<ApiResponse<ContactFormResponse>>(
				{
					success: true,
					data: {
						success: true,
						message:
							"Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.",
					},
				},
				{
					status: 200,
					headers: {
						"X-RateLimit-Limit": String(RATE_LIMIT_OPTIONS.maxRequests),
						"X-RateLimit-Remaining": String(
							Math.max(0, rateLimitResult.remaining - 1),
						),
						"X-RateLimit-Reset": String(rateLimitResult.resetTime),
					},
				},
			);
		} catch (error) {
			// Log error (captured by Vercel logs)
			logError(error instanceof Error ? error : new Error("Unknown error"), {
				endpoint: "/api/contact",
				method: "POST",
			});

			return NextResponse.json<ApiResponse<ContactFormResponse>>(
				{
					success: false,
					error: "Internal server error",
					message: "Une erreur est survenue lors de l'envoi du formulaire",
					data: {
						success: false,
						message: "Une erreur est survenue lors de l'envoi du formulaire",
					},
				},
				{ status: 500 },
			);
		}
	})();

	// Race between handler and timeout
	return Promise.race([handlerPromise, timeoutPromise]);
}
