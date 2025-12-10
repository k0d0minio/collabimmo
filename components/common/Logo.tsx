import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
	className?: string;
	width?: number;
	height?: number;
}

export function Logo({ className, width = 150, height = 50 }: LogoProps) {
	return (
		<Link href="/" className={cn("inline-block", className)}>
			<Image
				src="/logo.png"
				alt="Collabimmo"
				width={width}
				height={height}
				priority
				className="h-auto"
			/>
		</Link>
	);
}
