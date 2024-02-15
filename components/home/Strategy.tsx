import React from "react";

type Props = {};

export default function Strategy({}: Props) {
	return (
		<>
			<hr className='border-green-900' />
			<div
				id='strategy'
				className='py-[100px] px-[64px]'
			>
				<h1 className='text-3xl font-bold'>Our Three-Phase Strategy</h1>
				<div className='mt-8'>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center mb-16 hover:scale-110 transition-all text-gray-400'>
						<span className=' flex-1 text-5xl font-bold mb-2 md:mb-0 mr-2 text-gray-200'>
							One
						</span>{" "}
						<div className='flex-[3.33]'>
							<h3 className='text-lg font-semibold'>
								Funding Private Tree and Solar Projects
							</h3>
							Begin your journey by investing in private tree and solar farm
							projects. These initiatives are carefully selected for their
							environmental impact and potential for growth.
						</div>{" "}
					</div>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)]  flex flex-col md:flex-row my-4 md:items-center mb-16 hover:scale-110 transition-all text-gray-400'>
						<span className='flex-1 text-5xl font-bold mb-2 md:mb-0 mr-2 text-gray-200'>
							Two
						</span>{" "}
						<div className='flex-[3.33]'>
							<h3 className='text-lg font-semibold'>
								Research and Develop Tree Health Tracking System
							</h3>
							In this phase, you&apos;ll be able to stay closely informed and
							engaged with your tree project investments. Our innovative tree
							health tracking system will offer real-time data on the growth,
							health of the trees & soil of the tree projects you&apos;ve helped
							fund.
						</div>
					</div>{" "}
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center mb-16 hover:scale-110 transition-all text-gray-400'>
						<span className='flex-1 text-5xl font-bold mb-2 md:mb-0 mr-2 text-gray-200'>
							Three
						</span>{" "}
						<div className='flex-[3.33]'>
							<h3 className='text-lg font-semibold'>
								Starting Free Tree and Solar Projects
							</h3>
							As Eco Wealth grows, so does our commitment to the environment. We
							will initiate tree planting and solar projects to offer free
							produce and energy, expanding our reach and impact.
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
