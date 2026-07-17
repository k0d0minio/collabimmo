"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
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
};

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ children }: { children: React.ReactNode }) {
	const [leads, setLeads] = useState<Lead[]>(LEADS);
	const [messages, setMessages] = useState<Message[]>(MESSAGES);
	const [tasks, setTasks] = useState<CrmTask[]>(TASKS);
	const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);

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

	const value = useMemo<CrmContextValue>(
		() => ({
			leads,
			messages,
			properties: PROPERTIES,
			contacts: CONTACTS,
			tasks,
			activities,
			team: TEAM,
			setLeadStage,
			updateLeadNotes,
			markMessageRead,
			toggleMessageStar,
			markAllMessagesRead,
			toggleTask,
		}),
		[
			leads,
			messages,
			tasks,
			activities,
			setLeadStage,
			updateLeadNotes,
			markMessageRead,
			toggleMessageStar,
			markAllMessagesRead,
			toggleTask,
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
