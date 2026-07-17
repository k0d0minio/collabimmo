import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin/auth";

/**
 * Protects every /admin route (except the login page and auth API routes)
 * behind the shared admin password. Unauthenticated requests are redirected to
 * the login page with a `next` param so users land back where they intended.
 */
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isLoginPage = pathname === "/admin/login";
	const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
	const authenticated = await isValidSession(token);

	if (isLoginPage) {
		if (authenticated) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
		return NextResponse.next();
	}

	if (!authenticated) {
		const loginUrl = new URL("/admin/login", request.url);
		if (pathname !== "/admin") {
			loginUrl.searchParams.set("next", pathname);
		}
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
