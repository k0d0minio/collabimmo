import { type NextRequest, NextResponse } from "next/server";
import {
	ADMIN_SESSION_COOKIE,
	ADMIN_SESSION_MAX_AGE,
	createSessionToken,
	getAdminPassword,
	verifyPassword,
} from "@/lib/admin/auth";

type LoginBody = {
	password?: unknown;
};

export async function POST(request: NextRequest) {
	let body: LoginBody;
	try {
		body = (await request.json()) as LoginBody;
	} catch {
		return NextResponse.json(
			{ success: false, error: "Requête invalide." },
			{ status: 400 },
		);
	}

	const password = typeof body.password === "string" ? body.password : "";
	if (!password) {
		return NextResponse.json(
			{ success: false, error: "Mot de passe requis." },
			{ status: 400 },
		);
	}

	if (!verifyPassword(password)) {
		return NextResponse.json(
			{ success: false, error: "Mot de passe incorrect." },
			{ status: 401 },
		);
	}

	const token = await createSessionToken(getAdminPassword());
	const response = NextResponse.json({ success: true });
	response.cookies.set(ADMIN_SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: ADMIN_SESSION_MAX_AGE,
	});
	return response;
}
