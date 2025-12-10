"use client";

import { useCallback, useState } from "react";
import { submitContactForm } from "@/lib/api";
import { FORM_MESSAGES } from "@/lib/constants";
import {
	hasFormErrors,
	validateContactForm,
	validateField,
} from "@/lib/validations";
import type { ContactFormData, ContactFormErrors } from "@/types";

const initialFormData: ContactFormData = {
	firstname: "",
	name: "",
	email: "",
	phone: "",
	company: "",
	vatNumber: "",
	message: "",
	propertyType: "",
	consent: false,
	turnstileToken: undefined,
};

export function useContactForm() {
	const [formData, setFormData] = useState<ContactFormData>(initialFormData);
	const [errors, setErrors] = useState<ContactFormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const [submitMessage, setSubmitMessage] = useState("");
	const [turnstileResetKey, setTurnstileResetKey] = useState(0);

	const updateField = useCallback(
		(name: keyof ContactFormData, value: string | boolean) => {
			setFormData((prev) => ({ ...prev, [name]: value }));
			// Clear error when user starts typing
			if (errors[name]) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[name];
					return newErrors;
				});
			}
			// For email field, validate on change for immediate feedback
			if (name === "email" && typeof value === "string" && value.length > 0) {
				const skipTurnstileInDev = process.env.NODE_ENV === "development";
				const error = validateField(name, value, skipTurnstileInDev);
				if (error) {
					setErrors((prev) => ({ ...prev, [name]: error }));
				}
			}
		},
		[errors],
	);

	const validate = useCallback((): boolean => {
		// Skip Turnstile validation in development
		const skipTurnstileInDev = process.env.NODE_ENV === "development";
		const validationErrors = validateContactForm(formData, skipTurnstileInDev);
		setErrors(validationErrors);

		return !hasFormErrors(validationErrors);
	}, [formData]);

	const handleBlur = useCallback(
		(name: keyof ContactFormData) => {
			const value = formData[name];
			// Provide default values for undefined optional fields
			const valueToValidate = value ?? (name === "consent" ? false : "");
			// Skip Turnstile validation in development
			const skipTurnstileInDev = process.env.NODE_ENV === "development";
			const error = validateField(name, valueToValidate, skipTurnstileInDev);
			if (error) {
				setErrors((prev) => ({ ...prev, [name]: error }));
			} else {
				// Clear error if field is valid
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors[name];
					return newErrors;
				});
			}
		},
		[formData],
	);

	const updateTurnstileToken = useCallback(
		(token: string) => {
			setFormData((prev) => ({ ...prev, turnstileToken: token }));
			// Clear CAPTCHA error when token is set
			if (errors.turnstileToken) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.turnstileToken;
					return newErrors;
				});
			}
		},
		[errors.turnstileToken],
	);

	const reset = useCallback(() => {
		setFormData(initialFormData);
		setErrors({});
		setSubmitStatus("idle");
		setSubmitMessage("");
	}, []);

	const submit = useCallback(async () => {
		if (!validate()) {
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus("idle");
		setSubmitMessage("");

		try {
			const {
				firstname,
				name,
				email,
				phone,
				company,
				vatNumber,
				message,
				propertyType,
				turnstileToken,
				consent,
			} = formData;

			const response = await submitContactForm({
				firstname,
				name,
				email,
				phone: phone || undefined,
				company: company || undefined,
				vatNumber: vatNumber || undefined,
				message,
				propertyType: propertyType || undefined,
				turnstileToken: turnstileToken || undefined,
				consent: consent, // Include consent value
			});

			if (response.success) {
				setSubmitStatus("success");
				setSubmitMessage(FORM_MESSAGES.success);
				// Reset form data but keep success status/message visible
				setFormData(initialFormData);
				setErrors({});
				// Reset Turnstile widget after successful submission
				setTurnstileResetKey((prev) => prev + 1);
			} else {
				setSubmitStatus("error");

				// If there are validation errors from the server, merge them with local errors
				if (response.validationErrors) {
					setErrors((prev) => ({ ...prev, ...response.validationErrors }));
				}

				// Use detailed error message from server, or fallback to generic message
				const errorMessage =
					response.error || response.message || FORM_MESSAGES.error;
				setSubmitMessage(errorMessage);
			}
		} catch (error) {
			setSubmitStatus("error");
			const errorMessage =
				error instanceof Error
					? `Erreur: ${error.message}`
					: FORM_MESSAGES.error;
			setSubmitMessage(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validate]);

	return {
		formData,
		errors,
		isSubmitting,
		submitStatus,
		submitMessage,
		turnstileResetKey,
		updateField,
		updateTurnstileToken,
		validate,
		handleBlur,
		submit,
		reset,
	};
}
