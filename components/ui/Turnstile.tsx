"use client";

import {
	Turnstile as ReactTurnstile,
	type TurnstileInstance,
} from "@marsidev/react-turnstile";
import { useEffect, useRef } from "react";

interface TurnstileProps {
	onSuccess: (token: string) => void;
	onError?: () => void;
	onExpire?: () => void;
	siteKey: string;
	resetKey?: number;
}

export function Turnstile({
	onSuccess,
	onError,
	onExpire,
	siteKey,
	resetKey,
}: TurnstileProps) {
	const turnstileRef = useRef<TurnstileInstance>(null);
	// Tracks the last resetKey we acted on, so the widget is only reset when the
	// key actually changes and not on the initial mount.
	const lastResetKey = useRef(resetKey);

	useEffect(() => {
		if (resetKey === lastResetKey.current) {
			return;
		}
		lastResetKey.current = resetKey;
		turnstileRef.current?.reset();
	}, [resetKey]);

	const handleSuccess = (token: string) => {
		onSuccess(token);
	};

	const handleError = () => {
		onError?.();
	};

	const handleExpire = () => {
		onExpire?.();
	};

	// Note: siteKey validation happens at build time
	// In production, missing siteKey will show error UI instead of console logs

	if (!siteKey) {
		return (
			<div
				className="p-4 border border-red-300 rounded-md bg-red-50"
				role="alert"
			>
				<p className="text-sm text-red-800">
					⚠️ Security verification is not configured. Please contact the site
					administrator.
				</p>
				{process.env.NODE_ENV === "development" && (
					<p className="text-xs text-red-600 mt-1">
						Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY environment variable
					</p>
				)}
			</div>
		);
	}

	// Rendered unconditionally: @marsidev/react-turnstile emits a bare
	// <div id="cf-turnstile"> sized to the widget on the server and on the first
	// client render, and only touches `document` from its own effects. That is
	// byte-for-byte the placeholder this component used to render behind an
	// isMounted flag, so there is no hydration mismatch to guard against.
	return (
		<ReactTurnstile
			ref={turnstileRef}
			siteKey={siteKey}
			onSuccess={handleSuccess}
			onError={handleError}
			onExpire={handleExpire}
			options={{
				theme: "light",
				size: "normal",
			}}
		/>
	);
}
