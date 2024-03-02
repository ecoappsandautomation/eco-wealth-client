import withAuth from "@/utils/withAuth";
import Image from "next/image";
import React from "react";
import DashboardScreenshot from "@/assets/images/Dashboard - Screenshot.png";
import DiscoveryScreenshot from "@/assets/images/Discovery - Screenshot.png";
import EduScreenshot from "@/assets/images/Edu Center - Screenshot.png";
import JoinWaitlistButton from "./JoinWaitlistButton";
type Props = {};

export default function PrototypePreview({}: Props) {
	return (
		<div id='preview'>
			<hr className='border-green-900' />
			<div className='py-24 px-[64px]'>
				<h3 className='text-2xl md:text-3xl font-light'>
					Invest in tree-based agriculture and renewable energy projects with
					other investors worldwide, and make a meaningful impact on the
					environment while growing your wealth.
				</h3>
				<hr className='border-green-950 mt-24' />

				<h4 className='text-2xl font-light mt-16'>
					<span className='font-bold'>Your Voice Matters:</span> When you add
					your name to the waitlist, you&apos;re signalling to governments you
					demand solutions prioritizing planting trees, soil health, and
					transitioning to renewable energy.
				</h4>
				<p className='mt-8 text-lg font-bold text-gray-400'>
					Through signing up for the waitlist alone, you make a positive
					difference.
				</p>
				<JoinWaitlistButton />
			</div>
			<hr className='border-green-900' />
			<div className='py-[100px] px-[64px]'>
				<h2 className='text-3xl font-bold mb-2'>
					The Future of Sustainable Investing is Coming Soon
				</h2>
				<h3 className='text-2xl font-bold text-gray-500 mb-16'>
					Here&apos;s what you will get access to:
				</h3>
				<div className='md:flex md:flex-row-reverse md:items-center'>
					<Image
						src={DashboardScreenshot}
						alt=''
						width={450}
						height={500}
						className='rounded-lg border-[1px] border-[var(--cta-one)]  shadow-green-900 shadow-lg md:ml-16 md:mb-0 mb-8'
					/>
					<div>
						<h3 className='text-gray-500 font-bold text-lg'>
							Metrics & Analytics:
						</h3>
						<h4 className='text-2xl font-bold mb-2'>
							📈 See your impact. {<br />}Track your growth.
						</h4>
						<p className='text-gray-300'>
							Our dashboard is built with{" "}
							<b>Key Performance Indicators (KPIs)</b> in mind to provide you
							with critical insights into your investments and their collective
							impact.
						</p>
					</div>
				</div>
				<div className='mt-36 md:flex items-center'>
					<Image
						src={DiscoveryScreenshot}
						alt=''
						width={450}
						height={500}
						className='rounded-lg border-[1px] border-[var(--cta-one)] shadow-green-900 shadow-lg md:mr-16 md:mb-0 mb-8'
					/>
					<div>
						<h3 className='text-gray-500 font-bold text-lg'>
							Project Discovery & Recommendations:
						</h3>
						<h4 className='text-2xl font-bold mb-2'>
							💚 Find projects you love.
						</h4>
						<p className='text-gray-300'>
							With our discovery feature, you can find and invest in projects
							that match your preferences, goals, and impact areas. Whether you
							want to invest in renewable energy, tree-based agriculture, for
							profit or non-profit, we&apos;ve got you covered.
						</p>
					</div>
				</div>
				<div className='mt-36 md:flex md:flex-row-reverse items-center'>
					<Image
						src={EduScreenshot}
						alt=''
						width={450}
						height={500}
						className='rounded-lg border-[1px] border-[var(--cta-one)] shadow-green-900 shadow-lg md:ml-16 md:mb-0 mb-8'
					/>
					<div>
						<h3 className='text-gray-500 font-bold text-lg'>
							Education & Resources:
						</h3>
						<h4 className='text-2xl font-bold mb-2'>
							🌱 Learn, grow, and thrive.
						</h4>
						<p className='text-gray-300'>
							Our education center is designed to provide you with the resources
							and knowledge you need to make informed investment decisions.{" "}
							<br />
							<br />
							We believe that education is the key to making a positive impact
							on the environment and society. We encourage you to learn from all
							sources of information and make decisions that align with you.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
