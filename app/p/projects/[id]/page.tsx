"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "@/components/producer/projects/Project";
import withAuth from "@/utils/withAuth";
import axios from "axios";

function Projects() {
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState<
		Project | TreeProject | EnergyProject | null
	>(null);
	const fetchProject = async () => {
		await axios
			.post("/api/p/projects", {
				projectId: id,
				options: {
					query: `*, tree_projects(*), energy_projects(*), solar_projects(*), producer_properties(*), project_milestones(*), tree_investments(*), energy_investments(*), project_financials(*)`,
				},
			})
			.then((res) => {
				console.log("Project fetched:", res.data.data);
				setProject(convertToCamelCase(res.data.data[0]));
			})
			.catch((error) => {
				console.error("Error fetching project:", error.message);
				toast.error(error.message);
			});
	};
	useEffect(() => {
		fetchProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='p-4 w-[50%] mx-auto max-[960px]:w-[80%]'>
			<Project
				project={project}
				fetchProject={fetchProject}
				adminMode={true}
			/>
		</div>
	);
}

export default withAuth(Projects);
