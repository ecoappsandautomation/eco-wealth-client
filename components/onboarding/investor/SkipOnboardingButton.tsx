import React from "react";

type Props = {
	handleSkipOnboarding: (e: React.MouseEvent) => void;
};

export default function SkipOnboardingButton({ handleSkipOnboarding }: Props) {
	return (
		<button
			className='text-gray-500 mr-4 text-sm cursor-pointer transition-colors hover:text-gray-400'
			onClick={(e) => handleSkipOnboarding(e)}
		>
			Skip onboarding
		</button>
	);
}
