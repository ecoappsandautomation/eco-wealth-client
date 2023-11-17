"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store"; // Import RootState from your Redux store
import {
	navigateToInvestorDashboard,
	navigateToProducerDashboard,
} from "@/redux/actions"; // Import the actions from your actions file
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import About from "@/components/home/About";
import Strategy from "@/components/home/Strategy";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import RecentRegistrations from "@/components/RecentRegistrations";
import WaitingListGoalTracker from "@/components/WaitingListGoalTracker";

export default function Home() {
	const backgroundImageUrl =
		"https://storage.googleapis.com/msgsndr/6xhGkq67K123q2R9TMf0/media/644868002b9d838721622a4d.jpeg";
	const router = useRouter();
	const [treeCount, setTreeCount] = React.useState(0);
	const [arrayCount, setArrayCount] = React.useState(0);

	const user = useAppSelector((state: RootState) => state.user);

	const fetchTreeCount = async () => {
		const res = await fetch("/api/trees");
		const data = await res.json();
		setTreeCount(data.total);
	};

	const fetchArrayCount = async () => {
		const res = await fetch("/api/solarArrays");
		const data = await res.json();
		setArrayCount(data.total);
	};

	useEffect(() => {
		fetchTreeCount();
		fetchArrayCount();
	}, []);

	// useEffect(() => {
	// 	if (user.loggedIn) {
	// 		// Dispatch the appropriate navigation action based on the user's active role
	// 		if (user.roles.includes("investor")) {
	// 			dispatch(navigateToInvestorDashboard(user.id));
	// 		} else if (user.roles.includes("producer")) {
	// 			dispatch(navigateToProducerDashboard(user.id));
	// 		}
	// 	}
	// }, [user, dispatch]);

	const handleLoginClick = () => router.push("/login");
	const handleSignupClick = () => router.push("/signup");
	const handleWaitingListClick = () => router.push("/register");

	return (
		<>
			<div
				className='w-[100%] mx-auto h-[95vh] bg-cover bg-center flex justify-center items-center bg-no-repeat'
				style={{
					backgroundImage: `url(${backgroundImageUrl})`,
				}}
			>
				<div className='w-full h-full flex justify-center flex-col items-center bg-black bg-opacity-50'>
					<div className=' w-[80%] m-auto items-center md:w-[50%]'>
						{/* <h1 className='text-2xl font-light mb-4'>
						Together, we&apos;ve planted {treeCount} trees & installed{" "}
						{arrayCount} solar arrays.
					</h1> */}
						<h1 className='text-white font-bold text-2xl md:text-3xl md:w-[100%]'>
							Together, we can make a positive impact all around the world by{" "}
							<span className='text-green-400'> planting trees</span>,
							prioritizing <span className='text-green-400'> soil health</span>,
							and transitioning to{" "}
							<span className='text-green-400'> renewable energy</span>.
						</h1>
						{!user.loggedIn && (
							<div className='flex flex-col mt-6'>
								<h3 className='text-white text-right font-medium'>
									By using Eco Wealth, you can help bring balance to the
									environment and ensure future generations of people thrive.
								</h3>
								<button
									className='pulsate  cursor-pointer transition-all hover:scale-105 bg-green-600 text-white font-medium rounded-md text-sm lg:text-lg lg:px-8 px-4 py-2 mt-8'
									onClick={handleWaitingListClick}
								>
									Join the waiting list today
								</button>
								<WaitingListGoalTracker />
								{/* <h3 className='text-white text-right font-medium '>
								<span
									className='cursor-pointer transition-colors text-green-600 underline hover:text-green-300'
									onClick={handleLoginClick}
								>
									Login
								</span>{" "}
								or{" "}
								<span
									className='cursor-pointer transition-colors text-green-600 underline hover:text-green-300'
									onClick={handleSignupClick}
								>
									create an account
								</span>{" "}
								today.
							</h3> */}
							</div>
						)}
						{user.loggedIn && (
							<div className='flex flex-col mt-8'>
								<h3 className='text-[var(--main-link-color)] font-medium text-4xl mt-3 '>
									Make a difference today, {user.name}.
								</h3>
								<div className='flex'>
									{user.activeRole === "investor" ? (
										<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
											Search for a project
										</button>
									) : user.activeRole === "producer" ? (
										<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
											View your projects
										</button>
									) : (
										<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
											View your projects
										</button>
									)}
								</div>
							</div>
						)}
					</div>
					<div className='flex justify-end w-[100%]'>
						<h6 className='text-right text-white font-light mb-4 mr-4 text-xs opacity-50'>
							Photo by Matthew Smith via Unsplash.
						</h6>
					</div>
				</div>
			</div>
			<div className='lg:w-[800px] lg:mx-auto'>
				<About />
				<Strategy />
				<HowItWorks />
				<Pricing />
				<RecentRegistrations />
			</div>
		</>
	);
}
