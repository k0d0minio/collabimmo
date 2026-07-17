"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type {
	SuggestedContactPayload,
	SuggestedLeadPayload,
	SuggestedPropertyPayload,
	SuggestedTaskPayload,
	WhatsappQueueItem,
} from "@/lib/whatsapp/types";
import {
	ACTIVITIES,
	CONTACTS,
	LEADS,
	MESSAGES,
	PROPERTIES,
	TASKS,
	TEAM,
} from "./mock-data";
import type {
	Activity,
	Contact,
	CrmTask,
	Lead,
	LeadStage,
	Message,
	Property,
	TeamMember,
} from "./types";

type CrmContextValue = {
	leads: Lead[];
	messages: Message[];
	properties: Property[];
	contacts: Contact[];
	tasks: CrmTask[];
	activities: Activity[];
	team: TeamMember[];
	setLeadStage: (leadId: string, stage: LeadStage) => void;
	updateLeadNotes: (leadId: string, notes: string) => void;
	markMessageRead: (messageId: string, read?: boolean) => void;
	toggleMessageStar: (messageId: string) => void;
	markAllMessagesRead: () => void;
	toggleTask: (taskId: string) => void;
	/** Apply an AI-suggested action from the WhatsApp review queue to the CRM. */
	applySuggestedAction: (item: WhatsappQueueItem) => void;
};

const CrmContext = createContext<CrmContextValue | null>(null);

let idCounter = 0;
function nextId(prefix: string): string {
	idCounter += 1;
	return `${prefix}-${Date.now()}-${idCounter}`;
}

export function CrmProvider({ children }: { children: React.ReactNode }) {
	const [leads, setLeads] = useState<Lead[]>(LEADS);
	const [messages, setMessages] = useState<Message[]>(MESSAGES);
	const [properties, setProperties] = useState<Property[]>(PROPERTIES);
	const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
	const [tasks, setTasks] = useState<CrmTask[]>(TASKS);
	const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);

	const defaultOwner = TEAM[0]?.name ?? "Collabimmo";

	const pushActivity = useCallback((activity: Activity) => {
		setActivities((prev) => [activity, ...prev]);
	}, []);

	const setLeadStage = useCallback(
		(leadId: string, stage: LeadStage) => {
			setLeads((prev) =>
				prev.map((lead) =>
					lead.id === leadId
						? { ...lead, stage, lastActivityAt: new Date().toISOString() }
						: lead,
				),
			);
			const lead = leads.find((item) => item.id === leadId);
			if (lead && lead.stage !== stage) {
				pushActivity({
					id: `a-${leadId}-${stage}-${Date.now()}`,
					kind: stage === "won" ? "deal_won" : "stage_change",
					actor: lead.owner,
					summary:
						stage === "won"
							? `Affaire gagnée — ${lead.company}`
							: `${lead.name} déplacé vers « ${stage} »`,
					at: new Date().toISOString(),
				});
			}
		},
		[leads, pushActivity],
	);

	const updateLeadNotes = useCallback((leadId: string, notes: string) => {
		setLeads((prev) =>
			prev.map((lead) => (lead.id === leadId ? { ...lead, notes } : lead)),
		);
	}, []);

	const markMessageRead = useCallback((messageId: string, read = true) => {
		setMessages((prev) =>
			prev.map((message) =>
				message.id === messageId ? { ...message, read } : message,
			),
		);
	}, []);

	const toggleMessageStar = useCallback((messageId: string) => {
		setMessages((prev) =>
			prev.map((message) =>
				message.id === messageId
					? { ...message, starred: !message.starred }
					: message,
			),
		);
	}, []);

	const markAllMessagesRead = useCallback(() => {
		setMessages((prev) => prev.map((message) => ({ ...message, read: true })));
	}, []);

	const toggleTask = useCallback((taskId: string) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId ? { ...task, completed: !task.completed } : task,
			),
		);
	}, []);

	/**
	 * Apply a validated WhatsApp suggestion to the CRM. The inbound message is
	 * also recorded in the inbox as a `whatsapp` message so there's a trace.
	 */
	const applySuggestedAction = useCallback(
		(item: WhatsappQueueItem) => {
			const now = new Date().toISOString();
			const { message, analysis } = item;
			const action = analysis.suggestedAction;

			let leadId: string | undefined;

			if (action.type === "create_lead") {
				const p = action.payload as SuggestedLeadPayload;
				leadId = nextId("l");
				const lead: Lead = {
					id: leadId,
					name: p.name ?? message.senderName,
					company: p.company ?? "",
					role: "",
					email: p.email ?? "",
					phone: p.phone ?? message.senderPhone,
					source: "WhatsApp",
					stage: "new",
					priority: p.priority ?? "medium",
					value: 0,
					propertyInterest: p.propertyInterest ?? analysis.summary,
					propertyType: p.propertyType ?? "office",
					location: p.location ?? "",
					owner: defaultOwner,
					createdAt: now,
					lastActivityAt: now,
					tags: ["WhatsApp"],
					notes: message.text,
				};
				setLeads((prev) => [lead, ...prev]);
				pushActivity({
					id: nextId("a"),
					kind: "new_lead",
					actor: defaultOwner,
					summary: `Nouveau lead depuis WhatsApp — ${lead.name}`,
					at: now,
				});
			} else if (action.type === "create_task") {
				const p = action.payload as SuggestedTaskPayload;
				const due = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
				const task: CrmTask = {
					id: nextId("t"),
					title: p.title ?? analysis.summary,
					type: p.type ?? "follow_up",
					dueAt: due,
					completed: false,
					owner: defaultOwner,
					relatedName: p.relatedName ?? message.senderName,
				};
				setTasks((prev) => [task, ...prev]);
				pushActivity({
					id: nextId("a"),
					kind: "task",
					actor: defaultOwner,
					summary: `Tâche créée depuis WhatsApp — ${task.title}`,
					at: now,
				});
			} else if (action.type === "add_contact") {
				const p = action.payload as SuggestedContactPayload;
				const contact: Contact = {
					id: nextId("c"),
					name: p.name ?? message.senderName,
					role: "",
					company: p.company ?? "",
					email: p.email ?? "",
					phone: p.phone ?? message.senderPhone,
					type: p.type ?? "partner",
					city: p.city ?? "",
					lastContactAt: now,
				};
				setContacts((prev) => [contact, ...prev]);
				pushActivity({
					id: nextId("a"),
					kind: "note",
					actor: defaultOwner,
					summary: `Contact ajouté depuis WhatsApp — ${contact.name}`,
					at: now,
				});
			} else if (action.type === "add_property") {
				const p = action.payload as SuggestedPropertyPayload;
				const property: Property = {
					id: nextId("p"),
					reference: `WA-${idCounter}`,
					title: p.title ?? analysis.summary,
					type: p.type ?? "office",
					status: "available",
					transaction: "sale",
					city: p.city ?? "",
					address: "",
					price: p.price ?? 0,
					surface: p.surface ?? 0,
					description: p.description ?? message.text,
					addedAt: now,
					accent: "#3a4fff",
				};
				setProperties((prev) => [property, ...prev]);
				pushActivity({
					id: nextId("a"),
					kind: "note",
					actor: defaultOwner,
					summary: `Bien ajouté depuis WhatsApp — ${property.title}`,
					at: now,
				});
			} else {
				pushActivity({
					id: nextId("a"),
					kind: "note",
					actor: defaultOwner,
					summary: `Note WhatsApp — ${analysis.summary}`,
					at: now,
				});
			}

			// Record the inbound message in the inbox for traceability.
			const inboxMessage: Message = {
				id: nextId("m"),
				channel: "whatsapp",
				fromName: message.senderName,
				fromEmail: message.senderPhone,
				company: message.groupName,
				subject: analysis.summary,
				body: message.text,
				receivedAt: message.timestamp,
				read: false,
				starred: false,
				leadId,
			};
			setMessages((prev) => [inboxMessage, ...prev]);
		},
		[defaultOwner, pushActivity],
	);

	const value = useMemo<CrmContextValue>(
		() => ({
			leads,
			messages,
			properties,
			contacts,
			tasks,
			activities,
			team: TEAM,
			setLeadStage,
			updateLeadNotes,
			markMessageRead,
			toggleMessageStar,
			markAllMessagesRead,
			toggleTask,
			applySuggestedAction,
		}),
		[
			leads,
			messages,
			properties,
			contacts,
			tasks,
			activities,
			setLeadStage,
			updateLeadNotes,
			markMessageRead,
			toggleMessageStar,
			markAllMessagesRead,
			toggleTask,
			applySuggestedAction,
		],
	);

	return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
	const context = useContext(CrmContext);
	if (!context) {
		throw new Error("useCrm must be used within a CrmProvider");
	}
	return context;
}
