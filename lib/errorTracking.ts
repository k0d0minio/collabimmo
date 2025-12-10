/**
 * Error logging utilities
 *
 * Logs errors to console, which are automatically captured by Vercel logs.
 * For server-side errors, these will appear in Vercel's function logs.
 */

/**
 * Log an error with context
 * Errors are logged to console and captured by Vercel logs
 * @param error - Error to log
 * @param context - Additional context about the error
 */
export function logError(
	error: Error | unknown,
	context?: Record<string, unknown>,
): void {
	// Server-side only - logs are captured by Vercel
	if (typeof window === "undefined") {
		const errorObj = error instanceof Error ? error : new Error(String(error));
		// eslint-disable-next-line no-console
		console.error("[API Error]", {
			message: errorObj.message,
			stack: errorObj.stack,
			context,
		});
	}
}

/**
 * Log a message with context
 * @param message - Message to log
 * @param level - Log level (info, warning, error)
 * @param context - Additional context
 */
export function logMessage(
	message: string,
	level: "info" | "warning" | "error" = "info",
	context?: Record<string, unknown>,
): void {
	// Server-side only - logs are captured by Vercel
	if (typeof window === "undefined") {
		const logFn =
			level === "error"
				? console.error
				: level === "warning"
					? console.warn
					: console.log;
		// eslint-disable-next-line no-console
		logFn(`[API ${level.toUpperCase()}]`, message, context);
	}
}
