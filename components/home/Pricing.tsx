import React from "react";
import PricingTable from "./PricingTable";
import { useRouter } from "next/navigation";

type Props = {
	handleWaitingListClick: () => void;
};

export default function Pricing({ handleWaitingListClick }: Props) {
	const router = useRouter();
	const plans = [
		{
			title: "Project Equity Shares",
			subtitle: "(Investors)",
			price: "2.9% + $4 per transaction",
			features: [
				{ subtitle: "Coming Soon" },
				"Lifetime Ownership",
				"Long-term Dividend Returns",
				"Dedicated Email Support",
				"Transferrable",
				"Secure Transactions",
				"Tradeable",
				"28-Day Refund Guarantee",
				{ subtitle: "Coming 2025" },
				"Live Chat Support",
				"Phone Support",
				"AI Consultation",
			],
			ctaText: "Join Waiting List Today",
			ctaAction: () => {
				handleWaitingListClick();
			},
			externalCtaText: "*See investment disclaimer below.",
		},
		{
			title: "Investment Funding",
			subtitle: "(Producers)",
			price: "100% of Loan + Long Term Dividend",
			features: [
				{ subtitle: "Coming Soon" },
				"Custom Repayment & Dividend Schedule (% of Profit Margin)",
				"7-Day Cancellation Policy After Funded",
				"Transferrable",
				"Dedicated Email Support",
				{ subtitle: "Coming 2025" },
				"Seven Free Strategy Sessions with Financial & Operation Experts",
				"Live Chat Support",
				"Phone Support",
				"AI Project Management",
			],
			ctaText: "Join Waiting List Today",
			ctaAction: () => {
				handleWaitingListClick();
			},
		},
		{
			title: "Education & Resources",
			subtitle: "(Students & Teachers)",
			price: "Free",
			features: [
				{ subtitle: "Coming Soon" },
				"Unlimited On-Demand Access to Peer Reviewed Expert Agriculture, Investment, Business, Environmental and Energy Science Content & Resources",
				"Monthly Live Q&A With Industry Experts",
				{ subtitle: "Coming 2025" },
				"AI Tutor",
			],
			ctaText: "Join Waiting List Today",
			ctaAction: () => {
				handleWaitingListClick();
			},
			externalCtaLink:
				"https://docs.google.com/forms/d/e/1FAIpQLSf4ebDtVn2XNLGK1TusXRQVjLFmoCW0rIoEJh8vac4qwkL-LA/viewform?usp=sf_link",
			externalCta: `Apply here today.`,
			externalCtaText: "Want to teach?",
		},
		{
			title: "Eco Wealth Equity",
			subtitle: "(Accredited Investors)",
			price: "$1/share",
			features: [
				"1,000,000 Shares for 10% Stake Available",
				"Founder Profile Badge",
			],
			ctaText: "Apply Now",
			ctaAction: () => {
				router.push(
					"https://docs.google.com/forms/d/e/1FAIpQLScw2V4t2K0Pc0FAAN-0kVnHYjNtsb4HHMuhvwcYBHmyRNBZaA/viewform?usp=sf_link"
				);
			},
		},
	];
	return (
		<>
			<hr className='border-green-900' />
			<div
				id='pricing'
				className='pt-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>
					Transparent Pricing for Investments, Funding, and Education
				</h1>
				<div className='mt-12'>
					<PricingTable plans={plans} />
				</div>

				<div className='mt-12'>
					{/* Investment Processing Fees Section */}
					<div className='[&>*:nth-child(1)]:[&>*:nth-child(1)]:hover:text-[var(--h-one)]  flex flex-col md:hover:scale-110 md:hover:text-white md:flex-row my-4 md:items-center   text-gray-400 '>
						<div className='flex-1 mb-4 md:mb-0'>
							<h4 className='text-2xl font-bold text-gray-200'>
								Investment Processing Fees
							</h4>
						</div>
						<div className='flex-[3.33]'>
							<p className='transition-all  hover:!text-white '>
								<b>Merchant Order Processing Fee:</b> For each investment, a fee
								of <b>2.9% + $3 is applied</b>, covering secure and efficient
								processing.
							</p>
							<p className='mt-4 transition-all hover:!text-white'>
								<b>Administrative Cost:</b> A nominal <b>$1 fee</b> is charged
								for the smooth management and operation of your investments.
							</p>
						</div>
					</div>

					{/* Your Investment Benefits Section */}
					<div className='[&>*:nth-child(1)]:[&>*:nth-child(1)]:hover:text-[var(--h-one)] md:mt-12 flex flex-col md:flex-row my-4 md:items-center  md:hover:scale-110 md:hover:text-white text-gray-400 mb-8'>
						<div className='flex-1 mb-4 md:mb-0'>
							<h4 className='text-2xl font-bold text-gray-200'>
								Your Investment Benefits
							</h4>
						</div>
						<div className='flex-[3.33]'>
							<p className='transition-all hover:!text-white '>
								<b>Ownership of Project Share(s):</b> Gain direct ownership in
								green projects, impacting the environment and sustainable
								development.
							</p>
							<p className='transition-all hover:!text-white mt-4'>
								<b>Project Milestone Updates:</b> Receive regular updates on
								your project&apos;s progress and achievements.
							</p>
							<p className='transition-all hover:!text-white mt-4'>
								<b>Returns on Investment:</b> Enjoy returns based on the
								project&apos;s success and type, contributing to both the
								environment and your financial portfolio.
							</p>
							<p className='transition-all hover:!text-white mt-4'>
								<b>Flexibility in Ownership:</b> Adapt your investment portfolio
								as needed with options to sell or transfer shares.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
