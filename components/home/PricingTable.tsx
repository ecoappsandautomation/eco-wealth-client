// components/PricingTable.tsx

import Link from "next/link";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";

interface PricingPlan {
	title: string;
	subtitle?: string;
	price: string;
	features: (string | { subtitle: string })[];
	ctaAction: () => void;
	ctaText: string;
	externalCtaLink?: string;
	externalCta?: string;
	externalCtaText?: string;
}

interface PricingTableProps {
	plans: PricingPlan[];
}

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				{plans.map((plan, index) => (
					<div key={index}>
						<div className='bg-gradient-to-r from-[#000308] to-[#0C2100] hover:border-green-400 border-gray-700 border-[2px] text-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:shadow-green-700 transition-all hover:scale-105 [&>*:nth-child(3)]:hover:text-green-400 [&>*:nth-child(2)]:hover:text-green-400 [&>*:nth-child(1)]:hover:text-green-400'>
							<h2 className='text-lg font-semibold'>{plan.title}</h2>
							<h3 className='font-semibold mb-4'>{plan.subtitle}</h3>
							<p className='text-2xl font-bold mb-4'>{plan.price}</p>
							<hr className='border-gray-200 mb-4' />
							<ul className='text-sm mb-6'>
								{plan.features.map((feature, i) => (
									<React.Fragment key={i}>
										{typeof feature === "string" ? (
											<li className='flex items-center mb-2'>
												<BiCheckCircle className='text-green-400 m-2 text-lg flex-[0.2]' />
												<span className='flex-1'>{feature}</span>
											</li>
										) : (
											<h3 className='text-green-400 font-semibold mt-4 mb-2'>
												{feature.subtitle}
											</h3>
										)}
									</React.Fragment>
								))}
							</ul>
							<button
								onClick={plan.ctaAction}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-semibold py-2 px-4 rounded-lg w-full'
							>
								{plan.ctaText}
							</button>
						</div>
						{plan.externalCtaText && (
							<span className='text-xs '>
								{plan.externalCtaText}
								{plan.externalCtaLink && plan.externalCta && (
									<Link
										className='ml-[2px] text-[var(--cta-two-hover)] hover:text-green-300 transition-colors'
										href={plan.externalCtaLink}
									>
										{plan.externalCta}
									</Link>
								)}
							</span>
						)}
					</div>
				))}
			</div>
		</>
	);
};

export default PricingTable;
