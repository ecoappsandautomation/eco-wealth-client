"use client";
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import InvestorOnboarding from "@/components/onboarding/investor/InvestorOnboarding";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

function Onboarding() {
	// ... component code ...
	const user = useAppSelector((state: RootState) => state.user);
	const router = useRouter();
	useEffect(() => {
		if (user.investorOnboardingComplete && user.activeRole === "investor") {
			router.push("/i/dashboard");
		}
		if (user.activeRole === "producer") {
			if (user.producerOnboardingComplete) {
				router.push("/p/dashboard");
			} else {
				router.push("/p/onboarding");
			}
		}
	}, [user, router]);

	return (
		<div className='h-auto min-h-[100vh] w-[80%] mx-auto'>
			<h1 className='text-4xl mt-6 mb-2 font-light'>Eco Wealth</h1>
			<h2 className='text-2xl mb-6'>Investor Onboarding</h2>
			<p className='font-light text-base text-gray-400'>
				Complete your onboarding to activate your Eco Wealth Investor account
				today.
			</p>
			<InvestorOnboarding />
		</div>
	);
}

export default withAuth(Onboarding);
