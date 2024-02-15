"use client";
import Loading from "@/components/Loading";
import UserInvestments from "@/components/UserInvestments";
import Project from "@/components/producer/projects/Project";
import { useAppSelector } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";

type Props = {};

function PortfolioProject({}: Props) {
	const params = useParams();
	const projectId = params?.id;
	const user = useAppSelector((state) => state.user);
	const [project, setProject] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [percentageFunded, setPercentageFunded] = useState<any>(0);
	const [totalShares, setTotalShares] = useState<any>(0);
	const [totalAmountInvested, setTotalAmountInvested] = useState<any>(0);
	const fetchProject = async () => {
		setLoading(true);
		await axios
			.get(
				`/api/investor/portfolio/project?projectId=${projectId}&investorId=${user.investorId}`
			)
			.then((res) => {
				setLoading(false);
				setProject(convertToCamelCase(res.data.data));
				setTotalAmountInvested(res.data.totalAmountInvested);
				setTotalShares(res.data.totalShares);
				setPercentageFunded(res.data.percentageFunded);
			})
			.catch((err) => {
				setLoading(false);
				console.log("error fetching project >>> ", err);
			});
	};
	useEffect(() => {
		if (projectId && user) {
			fetchProject();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId, user]);
	if (loading) return <Loading />;
	return (
		<div className='w-[800px] mx-auto mt-4'>
			<Project
				adminMode={false}
				project={project}
				percentageFunded={percentageFunded}
			/>
			<UserInvestments
				energyInvestments={project?.energyInvestments}
				treeInvestments={project?.treeInvestments}
				treeProjectType={project?.treeProjects?.projectType}
				totalAmountInvested={totalAmountInvested}
				totalShares={totalShares}
			/>
		</div>
	);
}

export default withAuth(PortfolioProject);
