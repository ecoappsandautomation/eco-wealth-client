import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function ReferralMenu({}: Props) {
	const router = useRouter();
	// list of active referrals
	// list of pending, & previous payouts
	// show agreement
	// Links to share

	const HandleMenuLinkClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		{ destination }: { destination: string }
	) => {
		e.preventDefault();
		// navigate to destination
		router.push(`/referral-center?tab=${destination}`);
	};

	return (
		<div className='xl:flex-col flex'>
			<h2 className='mr-2 xl:mb-2'>Referral Menu</h2>
			<p
				className='mr-2 xl:mb-2 cursor-pointer'
				onClick={(e) => HandleMenuLinkClick(e, { destination: "links" })}
			>
				Links
			</p>
			<p
				className='mr-2 xl:mb-2 cursor-pointer'
				onClick={(e) => HandleMenuLinkClick(e, { destination: "referrals" })}
			>
				Referrals
			</p>
			<p
				className='mr-2 xl:mb-2 cursor-pointer'
				onClick={(e) => HandleMenuLinkClick(e, { destination: "payouts" })}
			>
				Payouts
			</p>

			<p
				className='mr-2 xl:mb-2 cursor-pointer'
				onClick={(e) => HandleMenuLinkClick(e, { destination: "agreement" })}
			>
				Agreement
			</p>
		</div>
	);
}
