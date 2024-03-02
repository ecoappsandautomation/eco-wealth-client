"use client";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function JoinWaitlistButton({}: Props) {
	const router = useRouter();
	const handleWaitingListClick = () => router.push("/register");
	return (
		<button
			className='glow mb-4 cursor-pointer transition-all bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-sm lg:text-lg lg:px-8 px-4 py-2 mt-8'
			onClick={() => handleWaitingListClick()}
		>
			Join the waiting list today
		</button>
	);
}
