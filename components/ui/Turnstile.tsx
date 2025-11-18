"use client";

import { Turnstile as ReactTurnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useEffect } from "react";

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

  if (!siteKey) {
    return null;
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

