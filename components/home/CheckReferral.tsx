"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import handleReferralId from "@/utils/handleReferralId";
type Props = {
	setReferralSource: (arg0: string) => void;
	setReferrer: (arg0: string) => void;
};

export default function CheckReferral({
	setReferralSource,
	setReferrer,
}: Props) {
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");

	const handleCheckReferral = () => {
		if (typeof window !== "undefined") {
			// The code now runs only on the client side

			if (ref) {
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(ref);
				return;
			} else {
				const storedData = localStorage.getItem("referralData");
				if (!storedData) return;
				const { referralId } = JSON.parse(storedData as string);
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(referralId);
			}
		}
	};

	// Check if referralId is present in URL or localStorage
	useEffect(() => {
		// Check if referralId is present in URL
		handleCheckReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);

	// Check if referralId is present in localStorage
	const handleExistingReferral = async (referralId: string) => {
		await handleReferralId(referralId, setReferrer);
	};
	return <></>;
}
