import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";

type Props = {
	setRefAgreement?: React.Dispatch<React.SetStateAction<boolean>>;
	referralId?: string;
	agreementAcceptedAt?: string;
};

export default function ReferralAgreement({
	setRefAgreement,
	referralId,
	agreementAcceptedAt,
}: Props) {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();

	// Add user to referral ambassador list if they agree to T&C and refresh the page
	const HandleAgreementClick = async () => {
		await axios
			.post("/api/confirm_referral_agreement", {
				userId: user.id,
			})
			.then(() => {
				if (setRefAgreement) {
					setRefAgreement(true);
				}
			})
			.catch((err) => {
				console.log("Unable to add user to referral ambassador list: ", err);
			});
	};

	// Push user to homepage if they do not agree to T&C
	const HandleDisagreementClick = async () => {
		router.push("/");
	};

	return (
		<div className='mt-4'>
			<h1>Eco Wealth Referral/Affiliate Policy</h1>
			<h2>1. Introduction</h2>
			<p>
				<strong>Objective:</strong> To create new investor and producer users,
				and to promote individual projects leading to new investor sign-ups.
			</p>
			<p>
				<strong>Target Audience:</strong> Eco-conscious individuals with a
				social media marketing and sales background.
			</p>

			<h2>2. Program Structure</h2>
			<ul>
				<li>
					<strong>Type of Program:</strong> Combination of referral and
					affiliate programs.
				</li>
				<li>
					Referral Program Phase: Targeted towards existing customers/users for
					referring friends or contacts.
				</li>
				<li>
					Affiliate Program Phase: To be launched publicly, allowing sign-ups
					without needing an investor or producer account.
				</li>
			</ul>

			<h2>3. Incentives and Rewards</h2>
			<ul>
				<li>
					<strong>Type of Compensation:</strong> Cash rewards.
				</li>
				<li>
					Project-Based Variance: No variance in rewards based on project type.
				</li>
				<li>
					Minimum Requirement: Referral must back a minimum of 3 projects for
					compensation to be triggered.
				</li>
			</ul>

			<h2>4. Terms and Conditions</h2>
			<ul>
				<li>
					<strong>Eligibility Criteria:</strong> Must be a resident of Canada or
					the US and have a social media account.
				</li>
				<li>
					Referral Limits: Unlimited referrals, but compensation is currently
					once per referred user (subject to change).
				</li>
				<li>
					Dispute Resolution: Escalation to compliance & legal department,
					possible legal action against fraud, and dispute settlement based on
					effort and tracked activity.
				</li>
			</ul>

			<h2>5. Tracking and Payments</h2>
			<ul>
				<li>
					<strong>Referral Tracking:</strong> Utilization of unique referral
					tracking links.
				</li>
				<li>Payment Method: Direct deposit.</li>
			</ul>

			<h2>6. Marketing and Promotion</h2>
			<ul>
				<li>
					<strong>Promotional Channels:</strong> Through the app and email
					marketing.
				</li>
				<li>
					Materials for Affiliates: Provision of landing pages, graphics, and
					video training (eventually).
				</li>
			</ul>

			<h2>7. Program Monitoring and Adjustments</h2>
			<ul>
				<li>
					<strong>Performance Monitoring:</strong> Internal high-level KPIs and
					individual KPIs for ambassadors (e.g., number of referred users, link
					clicks).
				</li>
				<li>
					Adjustments: Openness to making adjustments based on performance
					metrics and feedback.
				</li>
			</ul>

			<h2>8. Legal Compliance and Documentation</h2>
			<ul>
				<li>
					<strong>Legal Considerations:</strong> To be determined in
					consultation with a compliance specialist.
				</li>
				<li>
					Policy Documentation: Detailed policy documents to be reviewed and
					agreed upon by participants before creating their referral center
					account.
				</li>
			</ul>

			<p>Next Steps:</p>
			<ul>
				<li>
					Compliance Consultation: Engage with a compliance specialist to
					address legal considerations specific to your industry and operational
					regions.
				</li>
				<li>
					Policy Finalization: Refine and finalize the policy document based on
					legal inputs and any additional strategic decisions.
				</li>
				<li>
					Program Launch Preparation: Develop marketing materials, set up
					tracking systems, and prepare payment processes.
				</li>
			</ul>
			{!referralId ? (
				<div className='flex mt-2'>
					<button
						onClick={HandleAgreementClick}
						className='flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						I agree to the referral ambassador terms & conditions
					</button>
					<button
						onClick={HandleDisagreementClick}
						className='flex text-sm md:text-base items-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						I disagree
					</button>
				</div>
			) : (
				<div className='mt-4'>
					<p className='flex items-center text-green-500'>
						<BiCheckCircle className='mr-2 text-2xl' /> You completed this
						agreement on {agreementAcceptedAt}.
					</p>
				</div>
			)}
		</div>
	);
}
