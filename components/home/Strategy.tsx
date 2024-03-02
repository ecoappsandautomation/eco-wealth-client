import React from "react";
import Roadmap from "./Roadmap";
import JoinWaitlistButton from "./JoinWaitlistButton";

type Props = {};

export default function Strategy({}: Props) {
	const phaseOneRoadMapMilestones = [
		{
			name: "1 - Alpha Prototype Built",
			description:
				"Prototype built and released for testing, demonstration, and feedback.",
			date: "January 2024",
			currentMilestone: true,
			position: 40,
		},
		{
			name: "2 - Pre-seed Funding",
			description:
				"Pre-seed investment round with accredited investors and assembly of board of advisors.",
			date: "TBD - 2024",
			position: 70,
		},
		{
			name: "3 - Key Team Hiring",
			description:
				"Hire developers, designers, securities lawyers, financial analysts, advisors and support representatives to build the team.",
			date: "TBD - 2024",
			position: 100,
		},
		{
			name: "4 - Compliance Refactoring & Merchant Fee Reduction",
			description:
				"Refactor app with financial security regulatory compliance regulations, and reduce merchant transaction fees.",
			date: "TBD - 2024",
			position: 130,
		},
		{
			name: "4 - Tree and Solar Producers Onboarding",
			description:
				"Onboard tree and solar project producers and optimize business operations.",
			date: "TBD - 2024",
			position: 160,
		},
		{
			name: "5 - Launch Referral Program",
			description:
				"Officially open up ambassador program to compensate referral ambassadors when successfully inviting new investors to participate in funding projects.",
			date: "TBD - 2024",
			position: 180,
		},
		{
			name: "6 - Launch Education Center",
			description:
				"Onboard experts from finance, agriculture, and renewable energy & produce educational content for everyone for free.",
			date: "TBD - 2024",
			position: 210,
		},
		{
			name: "7 - Fund & Launch Initial Projects",
			description:
				"Together with industry experts, producers, and investors, fund & launch the initial tree and solar projects in North America.",
			date: "TBD - 2024",
			position: 250,
		},
		// Add more milestones as needed
	];

	return (
		<div
			id='strategy'
			className='anchor'
		>
			<hr className='border-green-900' />
			<div className='py-[100px] px-[64px] '>
				<h1 className='text-3xl font-bold'>Our Three-Phase Strategy</h1>
				<div className='mt-16'>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)] flex flex-col md:flex-row my-4 md:items-center mb-16 hover:scale-110 transition-all text-gray-400'>
						<span className=' flex-1 text-5xl font-bold mb-2 md:mb-0 mr-2 text-gray-200'>
							One
						</span>{" "}
						<div className='flex-[3.33]'>
							<h3 className='text-lg font-semibold'>
								Funding Private Tree and Solar Projects
							</h3>
							This is where the journey begins. Here you&apos;ll get access to
							invest in vetted tree and solar farm projects. These initiatives
							are carefully selected for their environmental impact and
							potential for growth.
						</div>{" "}
					</div>
					<div className='hidden md:block'>
						<h3 className='text-lg font-bold text-gray-500'>
							Phase One Roadmap:
						</h3>
						<Roadmap
							milestones={
								phaseOneRoadMapMilestones as {
									name: string;
									description: string;
									date: string;
									position: number;
									currentMilestone: boolean;
								}[]
							}
						/>
					</div>
					<div className='[&>*:nth-child(1)]:hover:text-[var(--h-one)]  flex flex-col md:flex-row my-4 md:items-center mb-16 hover:scale-110 transition-all text-gray-400'>
						<span className='flex-1 text-5xl font-bold mb-2 md:mb-0 mr-2 text-gray-200'>
							Two
						</span>{" "}
						<div className='flex-[3.33]'>
							<h3 className='text-lg font-semibold'>
								Research and Develop Tree Health Tracking System
							</h3>
							In this phase, we&apos;ll research and build a scalable tree &
							soil health tracking system so you&apos;ll be able to stay closely
							informed and engaged with your tree project investments. Our
							innovative tree health tracking system will offer real-time data
							on the growth, health of the trees & soil of the tree projects
							you&apos;ve helped fund.
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
				<div className='flex justify-center'>
					<JoinWaitlistButton />
				</div>
			</div>
		</div>
	);
}
