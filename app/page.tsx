"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RootState } from "@/redux/store"; // Import RootState from your Redux store

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import About from "@/components/home/About";
import Strategy from "@/components/home/Strategy";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import RecentRegistrations from "@/components/RecentRegistrations";
import WaitingListGoalTracker from "@/components/WaitingListGoalTracker";
import Disclaimer from "@/components/home/Disclaimer";
import Footer from "@/components/home/Footer";
import { setUser } from "@/redux/features/userSlice";
import handleReferralId from "@/utils/handleReferralId";
import PrototypePreview from "@/components/home/PrototypePreview";
import JoinWaitlistButton from "@/components/home/JoinWaitlistButton";

// TODO: remove guard statements in login & sign up pages when launching beta
export default function Home() {
	const backgroundImageUrl =
		"https://storage.googleapis.com/msgsndr/6xhGkq67K123q2R9TMf0/media/644868002b9d838721622a4d.jpeg";
	const router = useRouter();
	const [treeCount, setTreeCount] = React.useState(0);
	const [arrayCount, setArrayCount] = React.useState(0);

	const searchParams = useSearchParams();
	const referralId = searchParams?.get("r");

	// Store referralId in localStorage
	useEffect(() => {
		if (referralId) {
			handleReferralId(referralId);
		}
	}, [referralId]);

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
	const [pinnedQuestions, setPinnedQuestions] = useState([]);

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
	const dispatch = useAppDispatch();
	const handleInvestorClick = () => router.push("/i/discover");
	const handleProducerClick = () => router.push("/p/projects");
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, [user, dispatch]);

	return (
		<>
			<div
				className='z-0 absolute top-0 w-[100%] mx-auto h-[100vh] bg-cover bg-center flex justify-center items-center bg-no-repeat'
				style={{
					backgroundImage: `url(${backgroundImageUrl})`,
				}}
			>
				<div className='z-[1000] w-full h-full flex justify-center flex-col items-center bg-black bg-opacity-75'>
					<div className='z-[1000] w-[80%] m-auto items-center md:w-[50%]'>
						{/* <h1 className='text-2xl font-light mb-4'>
						Together, we&apos;ve planted {treeCount} trees & installed{" "}
						{arrayCount} solar arrays.
					</h1> */}
						<h1 className='text-white font-bold text-2xl md:text-3xl md:w-[100%] mt-8 md:mt-0'>
							Participate in creating a monumental positive impact worldwide by{" "}
							<span
								className='text-[var(--h-one)] cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									router.push("/#about");
								}}
							>
								{" "}
								planting trees
							</span>
							,{" "}
							<span
								className='text-[var(--h-one)] cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									router.push("/#about");
								}}
							>
								prioritizing soil health
							</span>
							, and{" "}
							<span
								className='text-[var(--h-one)] cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									router.push("/#about");
								}}
							>
								transitioning to renewable energy
							</span>
							.
						</h1>
						{!user.loggedIn && (
							<div>
								<h3 className='font-medium tracking-wide text-gray-400 text-lg md:text-2xl mt-4'>
									Bring balance between the environment and economy so we ensure
									future generations thrive.
								</h3>
								<button
									className='z-[1000] pulsate mb-4 cursor-pointer transition-all bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-sm lg:text-lg lg:px-8 px-4 py-2 mt-8'
									onClick={handleWaitingListClick}
								>
									Join the waiting list today
								</button>
								<WaitingListGoalTracker />
								{/* <h3 className='text-white text-right font-medium '>
								<span
									className='cursor-pointer transition-colors text-[var(--cta-one)] underline hover:text-[var(--cta-one-hover)]'
									onClick={handleLoginClick}
								>
									Login
								</span>{" "}
								or{" "}
								<span
									className='cursor-pointer transition-colors text-[var(--cta-one)] underline hover:text-[var(--cta-one-hover)]'
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
									Make a difference today, {user.name?.split(" ")[0]}.
								</h3>
								<div className='flex'>
									{user.activeRole === "investor" ? (
										<button
											onClick={handleInvestorClick}
											className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
										>
											Search for a project
										</button>
									) : user.activeRole === "producer" ? (
										<button
											onClick={handleProducerClick}
											className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
										>
											View your projects
										</button>
									) : null}
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
			<div className='2xl:w-[1200px] md:mx-auto mt-[90vh]'>
				<About />
				<PrototypePreview />
				<Strategy />
				<HowItWorks />
				<Pricing handleWaitingListClick={handleWaitingListClick} />
				<div className='flex justify-center'>
					<JoinWaitlistButton />
				</div>
				<RecentRegistrations />
				<Disclaimer />
				<Footer />
			</div>
		</>
	);
}
