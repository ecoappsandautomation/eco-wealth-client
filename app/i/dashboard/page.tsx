"use client";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Loading from "@/components/Loading";

interface DashboardProps {}
type MetricData = {
	data: [
		{
			totalTrees: number;
			totalPlantedTrees: number;
			treesContributed: number;
			totalEstKwhContributedPerYear: number;
			totalEnergyProduced: number;
			totalArraysInstalled: number;
			totalHomesPowered: number;
		}
	];
	totalData: {
		totalTrees: number;
		totalTreesPlanted: number;
		totalEnergyProduced: number;
		totalArraysInstalled: number;
		totalEstKwhContributedPerYear: number;
		treesContributed: number;
		totalHomesPowered: number;
	};
};

const Dashboard = ({}: DashboardProps) => {
	const user = useAppSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);
	const [metricData, setMetricData] = useState<MetricData | null>(null); // [TODO] - type this properly

	// State for animation
	const [totalUserTreeContributions, setTotalUserTreeContributions] =
		useState(0);
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [totalAppTreeCount, setTotalAppTreeCount] = useState(0);
	const [estUserEnergyContributions, setEstUserEnergyContributions] =
		useState(0);
	const [totalUserEnergyProduction, setTotalUserEnergyProduction] = useState(0);
	const [totalUserHomesPowering, setTotalUserHomesPowering] = useState(0);

	const [totalAppEnergyProduction, setTotalAppEnergyProduction] = useState(0);
	const [totalAppEnergyContribution, setTotalAppEnergyContribution] =
		useState(0);
	const [totalAppTreesContributed, setTotalAppTreesContributed] = useState(0);
	const [totalAppHomesPowering, setTotalAppHomesPowering] = useState(0);

	const fetchMetrics = async () => {
		setLoading(true);

		if (user && user.investorId) {
			await axios
				.get(`/api/investor_metrics?investorId=${user.investorId}`)
				.then((res) => {
					setMetricData(convertToCamelCase(res.data));
				})
				.catch((err) => {
					console.log("metrics err >>> ", err);
				});
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMetrics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user.investorId]);

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
		if (!metricData) return;
		animateValue(
			"totalUserTreeContributions",
			0,
			metricData?.data[0]?.treesContributed || 0,
			baseDuration,
			setTotalUserTreeContributions
		);

		animateValue(
			"totalUserTreeCount",
			0,
			metricData?.data[0]?.totalTrees || 0,
			baseDuration,
			setTotalUserTreeCount
		);

		animateValue(
			"totalUserEnergyProduction",
			0,
			metricData?.data[0]?.totalEnergyProduced || 0,
			baseDuration,
			setTotalUserEnergyProduction
		);
		animateValue(
			"estUserEnergyContributions",
			0,
			metricData?.data[0]?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setEstUserEnergyContributions
		);
		animateValue(
			"totalUserHomesPowering",
			0,
			metricData?.data[0]?.totalHomesPowered || 0,
			metricData?.data[0]?.totalHomesPowered > 1 ? baseDuration : 75,
			setTotalUserHomesPowering
		);
		animateValue(
			"targetTotalAppTreeCount",
			0,
			metricData?.totalData?.totalTreesPlanted || 0,
			baseDuration,
			setTotalAppTreeCount
		);
		animateValue(
			"targetTotalAppEnergyProduction",
			0,
			metricData?.totalData?.totalEnergyProduced || 0,
			baseDuration,
			setTotalAppEnergyProduction
		);
		animateValue(
			"totalAppTreesContributed",
			0,
			metricData?.totalData?.treesContributed || 0,
			baseDuration,
			setTotalAppTreesContributed
		);
		animateValue(
			"totalAppEnergyContribution",
			0,
			metricData?.totalData?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setTotalAppEnergyContribution
		);

		animateValue(
			"totalHomesPowering",
			0,
			metricData?.totalData?.totalHomesPowered || 0,
			metricData?.totalData?.totalHomesPowered > 1 ? baseDuration : 75,
			setTotalAppHomesPowering
		);
		return () => {
			// Clear all animations on component unmount
			// eslint-disable-next-line react-hooks/exhaustive-deps
			Object.keys(animationIntervals.current).forEach(clearAnimation);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metricData]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonnes = 1016.04691;

	if (loading)
		return (
			<div className='xl:w-[1200px] w-[90%] h-[100vh] mx-auto'>
				<h1 className='text-3xl font-semibold mt-8'>Investor Dashboard</h1>
				<Loading />
			</div>
		);

	return (
		<div className='w-3/4 mx-auto'>
			<h1 className='text-2xl md:text-3xl font-bold my-4 md:my-8'>
				Investor Dashboard | Hello {user.name}!
			</h1>
			<div className='text-sm md:text-base mx-auto border border-[var(--cta-one)] rounded-lg py-2 md:p-8 text-center mb-8'>
				<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4'>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;ve Contributed
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🌳 {totalUserTreeContributions?.toLocaleString("en-CA")}
						</p>
					</div>

					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;ve Planted
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🌳 {totalUserTreeCount?.toLocaleString("en-CA")}
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;ve Planted
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🌳 {totalAppTreeCount?.toLocaleString("en-CA")}
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;ve Contributed
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🌳 {totalAppTreesContributed?.toLocaleString("en-CA")}
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;ve Offset
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							☁️{" "}
							{Math.floor(
								totalAppTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;ve Offset
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							☁️{" "}
							{Math.floor(
								totalUserTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</p>
					</div>
				</div>
				<hr className='my-4 md:my-8 border-[var(--header-border)]' />
				<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-4'>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;ve Contributed
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							⚡ {estUserEnergyContributions?.toFixed(2).toLocaleString()} KWH
						</p>
					</div>

					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;ve Generated
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							⚡ {totalUserEnergyProduction?.toFixed(2).toLocaleString()} KWH
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;ve Generated
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							⚡ {totalAppEnergyProduction?.toFixed(2).toLocaleString()} KWH
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;ve Contributed
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							⚡ {totalAppEnergyContribution?.toFixed(2).toLocaleString()} KWH
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							Collectively We&apos;re Powering
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🏡 {totalAppHomesPowering.toFixed(2)}{" "}
							{totalAppHomesPowering < 1 ? (
								<span className='text-xs'>homes each year</span>
							) : totalAppHomesPowering === 1 ? (
								<span className='text-xs'>home per year</span>
							) : (
								<span className='text-xs'>homes per year</span>
							)}{" "}
						</p>
					</div>
					<div className='flex flex-col items-center md:p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<h3 className='mb-2 text-sm md:text-base text-gray-400'>
							You&apos;re Powering
						</h3>
						<p className='mt-0 text-sm md:text-base'>
							🏡 {totalUserHomesPowering.toFixed(2)}{" "}
							{totalUserHomesPowering < 1 ? (
								<span className='text-xs'>homes each year</span>
							) : totalUserHomesPowering === 1 ? (
								<span className='text-xs'>home for an entire year</span>
							) : (
								<span className='text-xs'>homes for an entire year</span>
							)}{" "}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
