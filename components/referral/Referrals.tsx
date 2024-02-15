import axios from "axios";
import React, { useState, useEffect } from "react";
import { StringLiteral } from "typescript";
import ReferralReport from "./ReferralReport";

type Referral = {
	name: string;
	email: string;
	dateReferred: string;
	type: string;
};

type Props = {
	referralId: string;
};

const Referrals = ({ referralId }: Props) => {
	const [referrals, setReferrals] = useState<Referral[]>([]);

	// Fetch referrals from the backend
	const fetchReferrals = async () => {
		axios
			.post("/api/referrals", {
				refId: referralId,
			})
			.then((res) => {
				setReferrals(res.data);
			})
			.catch((err) => {
				console.log("Unable to fetch referrals: ", err);
			});
	};

	// Run fetchReferrals on component mount
	useEffect(() => {
		fetchReferrals();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='mt-4'>
			<ReferralReport referralId={referralId} />
			<h2 className='text-2xl mb-2'>Your Referrals:</h2>
			<table className='w-[100%] border-white rounded-md border-[1px]'>
				<thead className='text-left border-b-[1px]'>
					<tr>
						<th className='p-2'>Name</th>
						<th>Email</th>
						<th>Date Referred</th>
						<th>Type</th>
					</tr>
				</thead>
				<tbody>
					{referrals.map((referral, index) => (
						<tr
							key={index}
							className='text-left border-b-[1px]'
						>
							<td className='p-2'>{referral.name}</td>
							<td>{referral.email}</td>
							<td>{referral.dateReferred}</td>
							<td>{referral.type}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Referrals;
