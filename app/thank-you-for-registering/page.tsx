"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

type Props = {};

export default function ThankYouForRegistering({}: Props) {
	const params = useSearchParams();
	const router = useRouter();
	function handleReturnHome() {
		router.push("/");
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen px-12'>
			<Image
				src='/white_logo_transparent_background.png'
				width={300}
				height={300}
				alt='Eco Wealth Logo'
				onClick={handleReturnHome}
				className='cursor-pointer'
			/>
			<h1 className='text-3xl font-bold mb-4'>
				Thank you for registering
				{params
					? `, ${params
							?.get("name")
							?.substring(0, params?.get("name")?.indexOf(" "))}! 🎉`
					: "! 🎉"}
			</h1>
			<p className='text-lg font-semibold'>
				Please check your inbox, an email with confirmation instructions was
				sent to your email address.
			</p>
		</div>
	);
}
