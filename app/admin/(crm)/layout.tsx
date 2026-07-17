import { AdminShell } from "@/components/admin/AdminShell";
import { CrmProvider } from "@/lib/admin/store";

export default function CrmLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<CrmProvider>
			<AdminShell>{children}</AdminShell>
		</CrmProvider>
	);
}
