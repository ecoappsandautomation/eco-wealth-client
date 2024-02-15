"use client";
import ReferralAgreement from "@/components/referral/ReferralAgreement";
import ReferralLinks from "@/components/referral/ReferralLinks";
import ReferralMenu from "@/components/referral/ReferralMenu";
import ReferralPayouts from "@/components/referral/ReferralPayouts";
import ReferralReport from "@/components/referral/ReferralReport";
import Referrals from "@/components/referral/Referrals";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

function ReferralCenter({}: Props) {
	const [refAgreement, setRefAgreement] = useState(false);
	const [referralId, setReferralId] = useState("");
	const [agreementAcceptedAt, setAgreementAcceptedAt] = useState("");
	const user = useAppSelector((state) => state.user);
	const searchParams = useSearchParams();
	const router = useRouter();
	// Check if user agreed to referral agreement
	useEffect(() => {
		axios
			.post("/api/verify_referral_agreement", {
				userId: user.id,
			})
			.then((res) => {
				if (res.data.verified) {
					setRefAgreement(true);
					setReferralId(res.data.refId);
					setAgreementAcceptedAt(res.data.agreementAcceptedAt);
				}
			})
			.catch((err) => {
				console.log("Unable to verify referral agreement: ", err);
			});
	}, [user]);
	const navigateTo = (path: string) => {
		router.push(path);
	};
	useEffect(() => {
		if (searchParams?.get("tab") === null) {
			navigateTo(`/referral-center/?tab=links`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const renderTabContent = (tab: string) => {
		switch (tab) {
			case "links":
				return <ReferralLinks referralId={referralId} />;
			case "referrals":
				return <Referrals referralId={referralId} />;
			case "payouts":
				return <ReferralPayouts />;
			case "agreement":
				return (
					<ReferralAgreement
						referralId={referralId}
						agreementAcceptedAt={agreementAcceptedAt}
					/>
				);
			default:
				return null;
		}
	};

	// Show referral agreement if user has not agreed to it yet
	if (!refAgreement) {
		return (
			<div className='w-[90vw] mx-auto my-8'>
				<h1 className='text-3xl mb-2'>Referral Center</h1>
				<ReferralAgreement setRefAgreement={setRefAgreement} />
			</div>
		);
	}

	// Show referral center if user has agreed to referral agreement
	if (refAgreement)
		return (
			<div className='w-[90vw] mx-auto my-8'>
				<h1 className='text-3xl mb-2'>Referral Center</h1>
				<div className='xl:flex flex-col'>
					<ReferralMenu />
					<div>
						{renderTabContent((searchParams?.get("tab") as string) || "links")}
					</div>
				</div>
			</div>
		);
}

export default withAuth(ReferralCenter);
