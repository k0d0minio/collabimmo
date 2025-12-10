export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	validationErrors?: Record<string, string>;
}

export interface ContactFormResponse {
	success: boolean;
	message: string;
	id?: string;
	validationErrors?: Record<string, string>;
}

export interface ContactFormRequest {
	firstname: string;
	name: string;
	email: string;
	phone?: string;
	company?: string;
	vatNumber?: string;
	message: string;
	propertyType?: string;
	consent?: boolean;
	turnstileToken?: string;
}
