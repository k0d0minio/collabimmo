/**
 * Admin authentication utilities.
 *
 * The admin section is gated by a single shared password provided via the
 * ADMIN_PASSWORD environment variable. A successful login stores a signed,
 * httpOnly session cookie whose value is derived from the password (never the
 * password itself). Both the login route (Node runtime) and the middleware
 * (Edge runtime) rely on the Web Crypto API so the same code runs in either
 * place.
 */

export const ADMIN_SESSION_COOKIE = "collabimmo_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

const SESSION_SALT = "collabimmo-admin-session-v1";

/**
 * The configured admin password. Falls back to a well-known demo value when the
 * environment variable is missing so the demo works out of the box; production
 * deployments should always set ADMIN_PASSWORD.
 */
export function getAdminPassword(): string {
	const value = process.env.ADMIN_PASSWORD;
	if (value && value.trim() !== "") {
		return value;
	}
	return "collabimmo-demo";
}

function toHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

/**
 * Derive the deterministic session token for a given password using
 * HMAC-SHA256. The token is safe to store in a cookie as it cannot be reversed
 * back into the password.
 */
export async function createSessionToken(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		encoder.encode(SESSION_SALT),
	);
	return toHex(signature);
}

/** Constant-time-ish comparison of two hex strings of equal expected length. */
function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

/** Verify that a raw password matches the configured admin password. */
export function verifyPassword(password: string): boolean {
	return safeEqual(password, getAdminPassword());
}

/** Verify that a session cookie value is a valid, current session token. */
export async function isValidSession(
	token: string | undefined,
): Promise<boolean> {
	if (!token) {
		return false;
	}
	const expected = await createSessionToken(getAdminPassword());
	return safeEqual(token, expected);
}
