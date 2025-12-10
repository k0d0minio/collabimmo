"use client";

import {
	Turnstile as ReactTurnstile,
	type TurnstileInstance,
} from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";

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
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (resetKey !== undefined && turnstileRef.current) {
			turnstileRef.current.reset();
		}
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

	if (!isMounted) {
		return <div id="cf-turnstile" style={{ width: "300px", height: "65px" }} />;
	}

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
