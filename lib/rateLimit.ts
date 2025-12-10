/**
 * Simple in-memory rate limiter for API routes
 * For production at scale, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
	setInterval(
		() => {
			const now = Date.now();
			Object.keys(store).forEach((key) => {
				if (store[key].resetTime < now) {
					delete store[key];
				}
			});
		},
		5 * 60 * 1000,
	);
}

export interface RateLimitOptions {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum requests per window
}

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param options - Rate limit options
 * @returns Rate limit result
 */
export function checkRateLimit(
	identifier: string,
	options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 },
): RateLimitResult {
	const now = Date.now();
	const entry = store[identifier];

	// If no entry or window expired, create new entry
	if (!entry || entry.resetTime < now) {
		store[identifier] = {
			count: 1,
			resetTime: now + options.windowMs,
		};
		return {
			allowed: true,
			remaining: options.maxRequests - 1,
			resetTime: now + options.windowMs,
		};
	}

	// Check if limit exceeded
	if (entry.count >= options.maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetTime: entry.resetTime,
		};
	}

	// Increment count
	entry.count++;
	return {
		allowed: true,
		remaining: options.maxRequests - entry.count,
		resetTime: entry.resetTime,
	};
}

/**
 * Get client identifier from request
 * Uses IP address, falling back to a combination of headers
 */
export function getClientIdentifier(request: Request): string {
	// Try to get IP from various headers (common in proxy setups)
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	const realIp = request.headers.get("x-real-ip");
	if (realIp) {
		return realIp;
	}

	// Fallback: use user agent + accept language as identifier
	// This is less ideal but better than nothing
	const ua = request.headers.get("user-agent") || "unknown";
	const lang = request.headers.get("accept-language") || "unknown";
	return `fallback:${ua.substring(0, 50)}:${lang.substring(0, 20)}`;
}
