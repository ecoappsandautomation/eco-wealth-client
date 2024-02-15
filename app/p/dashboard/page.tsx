"use client";
import { use, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import { setProducer } from "@/redux/features/producerSlice";
import { MdWarning } from "react-icons/md";
import convertToCamelCase from "@/utils/convertToCamelCase";
import UrgentNotification from "@/components/UrgentNotification";
import { set } from "react-hook-form";
import { IoMdAddCircle } from "react-icons/io";
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const handleNewProjectClick = () => {
		router.push("/p/add-project");
	};
	const userId = user.id;
	const dispatch = useAppDispatch();
	const producer = useAppSelector((state) => state.producer);
	const fetchProducerData = async () => {
		const res = await axios.get(`/api/producer?user_id=${userId}`);
		const data = await res.data;
		const producerData = convertToCamelCase(data?.producerData[0]);
		dispatch(
			setProducer({
				...data,
				id: producerData.id,
				producerProperties: producerData.producerProperties,
			})
		);
	};

	useEffect(
		() => {
			if (user && userId) {
				fetchProducerData();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user, userId]
	);
	const [urgentNotification, setUrgentNotification] = useState<{
		message: string;
		actionUrl: string;
		actionType: string;
	}>({ message: "", actionUrl: "", actionType: "" });

	const [allPropertiesUnverified, setAllPropertiesUnverified] = useState(false);

	useEffect(() => {
		if (producer && producer.id) {
			if (producer.producerProperties.length === 0) {
				setUrgentNotification({
					message: "You need to submit an address to create new projects.",
					actionUrl: "/settings?tab=properties",
					actionType: "Resolve Now",
				});
			} else {
				setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
			}
		}

		let numUnverifiedAddresses = 0;
		for (let i = 0; i < producer.producerProperties.length; i++) {
			if (producer.producerProperties[i].isVerified === false) {
				setUrgentNotification({
					message: `Your submitted property at ${producer.producerProperties[i].address.addressLineOne} in or near ${producer.producerProperties[i].address.city} is pending verification.`,
					actionUrl: "/settings?tab=properties",
					actionType: "View Details",
				});
				numUnverifiedAddresses++;
			}
		}

		if (numUnverifiedAddresses === producer.producerProperties.length) {
			setAllPropertiesUnverified(true);
			setUrgentNotification({
				message: `Starting a project requires a verified property. All properties currently pending verification.`,
				actionUrl: "/settings?tab=properties",
				actionType: "View Details",
			});
		} else if (numUnverifiedAddresses < producer.producerProperties.length) {
			setAllPropertiesUnverified(false);
		}
		if (numUnverifiedAddresses === 0) {
			setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
		}
	}, [producer]);

	// Metrics
	const [numOfInvestors, setNumOfInvestors] = useState(0);
	const [totalRaised, setTotalRaised] = useState(0);
	const [totalSharesSold, setTotalSharesSold] = useState(0);
	const [totalInvestorsPaid, setTotalInvestorsPaid] = useState(0);
	const [totalPaidToInvestors, setTotalPaidToInvestors] = useState(0);
	const [totalTreesContributionsReceived, setTotalTreesContributionsReceived] =
		useState(0);
	const [totalTreesPlanted, setTotalTreesPlanted] = useState(0);
	const [totalKwhContributionsReceived, setTotalKwhContributionsReceived] =
		useState(0);
	const [totalKwhGenerated, setTotalKwhGenerated] = useState(0);
	const [totalCarbonOffset, setTotalCarbonOffset] = useState(0);
	const [totalHomesPowered, setTotalHomesPowered] = useState(0);
	const [totalArraysInstalled, setTotalArraysInstalled] = useState(0);
	const [metricData, setMetricData] = useState<any>(null);
	const fetchMetrics = async () => {
		if (!user.producerId || user.producerId === "") return;
		axios
			.get(`/api/producer_metrics?producerId=${user.producerId}`)
			.then((res) => {
				const data = res.data;
				setMetricData(convertToCamelCase(data));
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(() => {
		fetchMetrics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user.producerId]);
	// This is for animation
	// Refs to keep track of intervals
	const animationIntervals = useRef<Record<string, number | null>>({});

	const clearAnimation = (key: string) => {
		if (animationIntervals.current[key]) {
			clearInterval(animationIntervals.current[key]!);
			animationIntervals.current[key] = null;
		}
	};

	// main animation function
	const animateValue = (
		key: string,
		start: number,
		end: number,
		baseDuration: number,
		callback: (value: number) => void
	) => {
		clearAnimation(key); // Clear any ongoing animation for this key

		let current = start;
		const range = end - start;
		const increment = range / (baseDuration / 100); // Adjust this for smoother animation
		const stepTime = Math.abs(baseDuration / range);

		animationIntervals.current[key] = setInterval(() => {
			current += increment;
			callback(current); // Update state

			if (
				(increment > 0 && current >= end) ||
				(increment < 0 && current <= end)
			) {
				callback(end); // Ensure the final value is set correctly
				clearAnimation(key);
			}
		}, stepTime) as unknown as number;
	};
	useEffect(() => {
		const baseDuration = 2000;
		if (!metricData?.data) return;
		animateValue(
			"numOfInvestors",
			0,
			metricData?.data[0]?.numOfInvestors || 0,
			baseDuration,
			setNumOfInvestors
		);

		animateValue(
			"totalRaised",
			0,
			metricData?.data[0]?.totalRaised || 0,
			baseDuration,
			setTotalRaised
		);

		animateValue(
			"totalInvestorsPaid",
			0,
			metricData?.data[0]?.numOfInvestorsPaid || 0,
			baseDuration,
			setTotalInvestorsPaid
		);
		animateValue(
			"totalPaidToInvestors",
			0,
			metricData?.data[0]?.totalPaidToInvestors || 0,
			baseDuration,
			setTotalPaidToInvestors
		);
		animateValue(
			"totalTreesContributionsReceived",
			0,
			metricData?.data[0]?.totalTreeContributionsReceived || 0,
			baseDuration,
			setTotalTreesContributionsReceived
		);
		animateValue(
			"totalTreesPlanted",
			0,
			metricData?.data[0]?.totalTreesPlanted || 0,
			baseDuration,
			setTotalTreesPlanted
		);
		animateValue(
			"totalKwhGenerated",
			0,
			metricData?.data[0]?.totalKwhGenerated || 0,
			baseDuration,
			setTotalKwhGenerated
		);
		animateValue(
			"totalKwhContributionsReceived",
			0,
			metricData?.data[0]?.totalKwhContributionsReceived || 0,
			baseDuration,
			setTotalKwhContributionsReceived
		);
		animateValue(
			"totalCarbonOffset",
			0,
			metricData?.data[0]?.totalCarbonOffset || 0,
			baseDuration,
			setTotalCarbonOffset
		);
		animateValue(
			"totalHomesPowered",
			0,
			metricData?.data[0]?.totalHomesPowered || 0,
			baseDuration,
			setTotalHomesPowered
		);
		animateValue(
			"totalArraysInstalled",
			0,
			metricData?.data[0]?.totalArraysInstalled || 0,
			baseDuration,
			setTotalArraysInstalled
		);
		animateValue(
			"totalSharesSold",
			0,
			metricData?.data[0]?.totalSharesSold || 0,
			baseDuration,
			setTotalSharesSold
		);
		return () => {
			// Clear all animations on component unmount
			Object.keys(animationIntervals.current).forEach(clearAnimation);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metricData]);
	return (
		<div className='min-h-[100vh] w-[100%]'>
			<div className='w-3/4 mx-auto'>
				{!user.name ? (
					<h1 className='my-6 text-2xl'>Producer Dashboard</h1>
				) : (
					<h1 className='my-6 text-2xl'>
						Producer Dashboard | Hello {user.name}!
					</h1>
				)}
			</div>
			{urgentNotification.message !== "" && (
				<UrgentNotification urgentNotification={urgentNotification} />
			)}
			{producer.producerProperties.length > 0 && !allPropertiesUnverified && (
				<div className='flex justify-between items-center mb-4 w-3/4 mx-auto border border-gray-700  rounded-lg p-4'>
					<h2 className='md:text-xl tracking-wide text-gray-400 font-semibold'>
						Create a new project today
					</h2>
					<button
						onClick={handleNewProjectClick}
						className='flex text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						<IoMdAddCircle className='text-2xl mr-2' /> New project
					</button>
				</div>
			)}
			<div className='w-3/4 text-sm md:text-base mx-auto border border-[var(--cta-one)] rounded-lg py-2 md:p-8 text-center'>
				<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4'>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>Number of Investors</p>
						<h2 className='mt-0'>{numOfInvestors?.toLocaleString("en-CA")}</h2>
					</div>

					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve Raised</p>
						<h2 className='mt-0'>${totalRaised?.toLocaleString("en-CA")}</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve Paid</p>
						<h2 className='mt-0'>
							{totalInvestorsPaid?.toLocaleString("en-CA")} investors
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve paid</p>
						<h2 className='mt-0'>
							${totalPaidToInvestors?.toLocaleString("en-CA")} to investors
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>
							Total Trees Contributions Received
						</p>
						<h2 className='mt-0'>
							🌳 {totalTreesContributionsReceived?.toLocaleString("en-CA")}{" "}
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve Planted:</p>
						<h2 className='mt-0'>
							🌳 {totalTreesPlanted?.toLocaleString("en-CA")}
						</h2>
					</div>
				</div>
				<hr className='my-2 border-[var(--cta-one)]' />
				<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4'>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve Generated:</p>
						<h2 className='mt-0'>
							⚡ {totalKwhGenerated?.toLocaleString("en-CA")} KWH
						</h2>
					</div>

					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>
							Total KWH Contributions Received:
						</p>
						<h2 className='mt-0'>
							⚡ {totalKwhContributionsReceived?.toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;re offsetting:</p>
						<h2 className='mt-0'>
							☁️ {totalCarbonOffset?.toLocaleString("en-CA")} kg of CO²
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve installed</p>
						<h2 className='mt-0'>
							☀️ {totalArraysInstalled?.toLocaleString("en-CA")} solar arrays
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;ve sold</p>
						<h2 className='mt-0'>
							📈 {totalSharesSold.toLocaleString("en-CA")} shares
						</h2>
					</div>
					<div className='flex flex-col items-center py-2 px-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='md:mb-2 text-gray-400'>You&apos;re Powering:</p>
						<h2 className='mt-0'>
							🏡 {totalHomesPowered.toLocaleString("en-CA")}{" "}
							{totalHomesPowered < 1
								? "of a home for an entire year"
								: totalHomesPowered === 1
								? "home for an entire year"
								: "homes for an entire year"}{" "}
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
