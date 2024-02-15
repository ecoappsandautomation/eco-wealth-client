"use client";

import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import TreeInvestment from "@/components/investor/projects/TreeInvestment";
import EnergyInvestment from "@/components/investor/projects/EnergyInvestment";
import axios from "axios";
function Invest() {
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState<Project>({} as Project);
	const [sharesRemaining, setSharesRemaining] = useState<number>(0);
	useEffect(() => {
		const fetchProject = async () => {
			await axios
				.post("/api/project", { projectId: id })
				.then((res) => {
					setProject(convertToCamelCase(res.data.data));
					setSharesRemaining(res.data.shares_remaining);
				})
				.catch((error) => {
					console.error("Error fetching project:", error.message);
				});
		};
		if (id) {
			fetchProject();
		}
	}, [id]);
	return (
		<div className='flex p-8'>
			{project?.type === "Tree" ? (
				<TreeInvestment
					project={project}
					sharesRemaining={sharesRemaining}
				/>
			) : project?.type === "Energy" ? (
				<EnergyInvestment
					project={project}
					sharesRemaining={sharesRemaining}
				/>
			) : null}
		</div>
	);
}

export default withAuth(Invest);

// Styled components
