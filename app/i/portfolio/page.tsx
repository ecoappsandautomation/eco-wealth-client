"use client";
import PortfolioCard from "@/components/investor/portfolio/PortfolioCard";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import Loading from "@/components/Loading";

type Props = {};

function Portfolio({}: Props) {
	const [projects, setProjects] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [totalShares, setTotalShares] = useState<any>([]);
	const [totalAmountInvested, setTotalAmountInvested] = useState<any>([]);
	const user = useAppSelector((state) => state.user);
	// axios call to get investor portfolio
	const fetchUserPortfolio = async () => {
		const res = await axios.get(
			`/api/investor/portfolio?investorId=${user.investorId}`
		);
		console.log("res >>> ", res);
		if (res.data.data.length > 0) {
			setProjects(convertToCamelCase(res.data.data));
			setTotalShares(res.data.totalShares);
			setTotalAmountInvested(res.data.totalAmountInvested);
			setLoading(false);
			return;
		}
		if (res.status === (400 || 401)) {
			console.log("error fetching investor portfolio projects");
			setLoading(false);
			return;
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user.investorId) {
			fetchUserPortfolio();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	if (loading)
		return (
			<div className='xl:w-[1200px] mx-auto w-[90%]'>
				<h1 className='text-3xl font-bold mt-8'>Your Portfolio</h1>
				<Loading />
			</div>
		);
	if (!loading && projects.length === 0)
		return (
			<div className='xl:w-[1200px] mx-auto w-[90%]'>
				<h1 className='text-3xl font-bold mt-8 ml-8 lg:ml-0'>Your Portfolio</h1>
				<div className='flex flex-col items-center justify-center h-[80vh]'>
					<h3 className='text-2xl font-bold mb-4'>
						No projects found in your portfolio yet.
					</h3>
					<p className='text-lg text-center'>Ready to invest into a project?</p>
					<p className='mt-2 font-bold text-center'>
						<Link
							href='/i/discover'
							className='text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] transition-all cursor-pointer'
						>
							Head over to the project discovery page
						</Link>{" "}
						to find a project to <br />
						contribute to.
					</p>
				</div>
			</div>
		);
	return (
		<div className='w-[90%] lg:w-3/4 mx-auto py-8 h-[100%]'>
			<h1 className='text-3xl font-bold md:mt-8'>Your Portfolio</h1>
			<div className='flex flex-wrap'>
				{projects &&
					projects.length > 0 &&
					projects.map((project: any, index: number) => {
						return (
							<PortfolioCard
								project={project}
								key={project.id}
								totalShares={totalShares[index]}
								totalAmountInvested={totalAmountInvested[index]}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default withAuth(Portfolio);
