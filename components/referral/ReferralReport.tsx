import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {
	referralId: string;
};

export default function ReferralReport({ referralId }: Props) {
	const [totalCollectiveReferrals, setCollectiveTotalReferrals] = useState(0);
	const [totalCollectivePotentialPayouts, setTotalCollectivePotentialPayouts] =
		useState(0);
	const [totalReferralAmbassadors, setTotalReferralAmbassadors] = useState(0);
	const [totalUserReferrals, setTotalUserReferrals] = useState(0);
	const [totalUserPotentialPayout, setTotalUserPotentialPayout] = useState(0);
	// Get referral report
	const getReport = async () => {
		axios
			.post("/api/referral_report", { referralId: referralId })
			.then((res) => {
				console.log(res.data);
				setCollectiveTotalReferrals(res.data.totalReferrals);
				setTotalCollectivePotentialPayouts(res.data.totalPotentialPayout);
				setTotalReferralAmbassadors(res.data.totalReferralAmbassadors);
				setTotalUserReferrals(res.data.totalUserReferrals);
				setTotalUserPotentialPayout(res.data.totalUserPotentialPayout);
			})
			.catch((err) => {
				console.log("Unable to get referral report: ", err);
			});
	};
	useEffect(() => {
		getReport();
	}, []);

	return (
		<div className='mb-4'>
			<div className='flex justify-between'>
				<div className='flex flex-col'>
					<div>
						<h1>Collective Potential Payout</h1>
						<p>${totalCollectivePotentialPayouts}</p>
					</div>
					<div className='mt-4'>
						<h1>Your Potential Payout</h1>
						<p>${totalUserPotentialPayout}</p>
					</div>
				</div>

				<div className='flex flex-col'>
					<div>
						<h1>Collective Referrals</h1>
						<p>{totalCollectiveReferrals}</p>
					</div>
					<div className='mt-4'>
						<h1>Your Total Referrals</h1>
						<p>{totalUserReferrals}</p>
					</div>
				</div>
				<div>
					<h1>Collective Referral Ambassadors</h1>
					<p>{totalReferralAmbassadors}</p>
				</div>
			</div>
		</div>
	);
}
