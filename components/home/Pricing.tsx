import React from "react";

type Props = {};

export default function Pricing({}: Props) {
	return (
		<>
			<hr className='border-green-900' />
			<div
				id='pricing'
				className='pt-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>
					Transparent Pricing for Your Investments
				</h1>
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
								of 2.9% + $3 is applied, covering secure and efficient
								processing.
							</p>
							<p className='mt-4 transition-all hover:!text-white'>
								<b>Administrative Cost:</b> A nominal $1 fee is charged for the
								smooth management and operation of your investments.
							</p>
						</div>
					</div>

					{/* Your Investment Benefits Section */}
					<div className='[&>*:nth-child(1)]:[&>*:nth-child(1)]:hover:text-[var(--h-one)] md:mt-12 flex flex-col md:flex-row my-4 md:items-center  md:hover:scale-110 md:hover:text-white text-gray-400 '>
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
