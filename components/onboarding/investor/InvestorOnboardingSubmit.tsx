import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
type Props = {
	handleUpdateInvestorOnboardingData: () => void;
};

export default function InvestorOnboardingSubmit({
	handleUpdateInvestorOnboardingData,
}: Props) {
	const [loadingMessage, setLoadingMessage] =
		useState(`Submitting your answers and activating
	your investor account...`);
	useEffect(() => {
		handleUpdateInvestorOnboardingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex flex-col justify-center items-center h-[60vh] text-center'>
			<CircularProgress
				className='mb-8'
				color='success'
			/>
			{loadingMessage}
		</div>
	);
}
