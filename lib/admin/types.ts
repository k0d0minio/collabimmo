export type LeadStage =
	| "new"
	| "contacted"
	| "qualified"
	| "proposal"
	| "negotiation"
	| "won"
	| "lost";

export type Priority = "low" | "medium" | "high";

export type PropertyType =
	| "office"
	| "retail"
	| "warehouse"
	| "industrial"
	| "land"
	| "mixed";

export type PropertyStatus =
	| "available"
	| "under_offer"
	| "sold"
	| "rented"
	| "off_market";

export type TransactionType = "sale" | "rent";

export type MessageChannel = "email" | "form" | "phone" | "whatsapp";

export type TaskType =
	| "call"
	| "email"
	| "meeting"
	| "viewing"
	| "follow_up"
	| "document";

export type ActivityKind =
	| "new_lead"
	| "stage_change"
	| "deal_won"
	| "message"
	| "viewing"
	| "note"
	| "task";

export type ContactType =
	| "investor"
	| "tenant"
	| "owner"
	| "partner"
	| "notary";

export type TeamMember = {
	id: string;
	name: string;
	role: string;
	initials: string;
};

export type Lead = {
	id: string;
	name: string;
	company: string;
	role: string;
	email: string;
	phone: string;
	source: string;
	stage: LeadStage;
	priority: Priority;
	value: number;
	propertyInterest: string;
	propertyType: PropertyType;
	location: string;
	owner: string;
	createdAt: string;
	lastActivityAt: string;
	tags: string[];
	notes: string;
};

export type Message = {
	id: string;
	channel: MessageChannel;
	fromName: string;
	fromEmail: string;
	company?: string;
	subject: string;
	body: string;
	receivedAt: string;
	read: boolean;
	starred: boolean;
	leadId?: string;
};

export type Property = {
	id: string;
	reference: string;
	title: string;
	type: PropertyType;
	status: PropertyStatus;
	transaction: TransactionType;
	city: string;
	address: string;
	price: number;
	surface: number;
	description: string;
	addedAt: string;
	accent: string;
};

export type Contact = {
	id: string;
	name: string;
	role: string;
	company: string;
	email: string;
	phone: string;
	type: ContactType;
	city: string;
	lastContactAt: string;
	portfolioValue?: number;
};

export type CrmTask = {
	id: string;
	title: string;
	type: TaskType;
	dueAt: string;
	completed: boolean;
	owner: string;
	relatedName?: string;
	relatedLeadId?: string;
};

export type Activity = {
	id: string;
	kind: ActivityKind;
	actor: string;
	summary: string;
	at: string;
};
