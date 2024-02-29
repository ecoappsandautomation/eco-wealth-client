import React from "react";

type Props = {};

export default function HowItWorks({}: Props) {
	return (
		<div
			id='how-it-works'
			className='anchor'
		>
			<hr className='border-green-900' />
			<div className='py-[100px] px-[64px]'>
				<h1 className='text-3xl font-bold'>
					How Eco Wealth Works: A Simple Path to Green Investing
				</h1>
				<div className='mt-16'>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row mt-4 md:items-center hover:scale-110 transition-all text-gray-400 hover:!text-white mb-16'>
						<span className='flex-1 mb-2 md:mb-0 text-2xl md:text-4xl font-bold mr-2 text-gray-200'>
							Sign Up and Explore
						</span>
						<div className='flex-[2.22]'>
							<h3 className='text-lg font-semibold'>
								Begin your journey by signing up on the Eco Wealth app. Browse
								through a curated selection of tree and solar projects, each
								with a detailed profile outlining its environmental impact and
								investment potential.
							</h3>
						</div>
					</div>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center hover:scale-110 transition-all text-gray-400 hover:!text-white mb-16'>
						<span className='flex-1 mb-2 md:mb-0 text-2xl md:text-4xl font-bold mr-2 text-gray-200'>
							Choose Your Investment
						</span>
						<div className='flex-[2.22]'>
							<h3 className='text-lg font-semibold'>
								Select the project that resonates with you. Decide how many
								shares you wish to purchase, giving you flexibility and control
								over your investment amount.
							</h3>
						</div>
					</div>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center hover:scale-110 transition-all text-gray-400 hover:!text-white mb-16'>
						<span className='flex-1 mb-2 md:mb-0 text-2xl md:text-4xl font-bold mr-2 text-gray-200'>
							Fund the Future
						</span>
						<div className='flex-[2.22]'>
							<h3 className='text-lg font-semibold'>
								Complete your investment to fund the project. Investments are
								pooled, and once a project reaches 80% of its funding goal, the
								producer can kickstart operations using the accumulated funds.
							</h3>
						</div>
					</div>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center hover:scale-110 transition-all text-gray-400 hover:!text-white mb-16'>
						<span className='flex-1 mb-2 md:mb-0 text-2xl md:text-4xl font-bold mr-2 text-gray-200'>
							Track Progress and Receive Returns
						</span>
						<div className='flex-[2.22]'>
							<h3 className='text-lg font-semibold'>
								Stay updated on your project&apos;s growth and success. As the
								project matures, producers will distribute returns from the sale
								profits. Depending on the type of tree project, these returns
								are issued on a quarterly, semi-annual, or annual basis,
								ensuring a steady and rewarding investment experience.
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
