/**
 * Input sanitization utilities
 * Sanitizes user input to prevent XSS attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text safe for HTML rendering
 */
export function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitize text input by trimming and escaping HTML
 * @param input - Input to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(input: string | undefined | null): string {
	if (!input) return "";
	return escapeHtml(String(input).trim());
}

/**
 * Sanitize email address (basic validation, no HTML escaping needed for email)
 * @param email - Email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string | undefined | null): string {
	if (!email) return "";
	return String(email).trim().toLowerCase();
}
