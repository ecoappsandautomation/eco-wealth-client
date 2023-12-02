import React, { useState, useEffect, FC } from "react";
import { useParams } from "next/navigation";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "./producer/projects/Project";
import InvestButton from "./investor/projects/InvestButton";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import Loading from "./Loading";
import axios from "axios";

type Props = {};

const ProjectDetails = ({}: Props) => {
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState(
		{} as Project | TreeProject | EnergyProject
	);
	const [uniqueInvestors, setUniqueInvestors] = useState<any>(0);
	const [percentageFunded, setPercentageFunded] = useState<any>(0);
	useEffect(() => {
		if (!id) {
			return;
		}

		const fetchProject = async () => {
			axios.get(`/api/investor/projects?projectId=${id}`).then((res) => {
				console.log("res.data >>> ", res.data);
				setProject(convertToCamelCase(res.data.data));
				setUniqueInvestors(res.data.uniqueInvestors);
				setPercentageFunded(res.data.percentageFunded);
			});
		};

		fetchProject();
	}, [id]);

	const user = useAppSelector((state: RootState) => state.user);
	const [showInvestButton, setShowInvestButton] = useState(true);
	useEffect(() => {
		if (project.producerId === user.producerId) {
			setShowInvestButton(false);
		}
	}, [user, project]);
	// Render the project details or a loading message if the data is not yet available
	return (
		<div className='mt-4 h-[1000px]'>
			{Object.entries(project).length > 0 ? (
				<div className='flex flex-col md:flex-row justify-center   lg:w-[1200px] lg:mx-auto'>
					<div className='w-[800px]'>
						<Project
							adminMode={false}
							project={project}
							percentageFunded={percentageFunded}
						/>
					</div>
					{showInvestButton && project.id && (
						<div className='flex flex-col items-center border-green-400 border-[1px] border-opacity-20 h-min  transition-all p-6 rounded-md ml-8 sticky top-28'>
							{uniqueInvestors && uniqueInvestors === 1 ? (
								<p className='mb-4 text-sm'>
									<span className='font-bold'>{uniqueInvestors} investor</span>{" "}
									has backed this project.
								</p>
							) : (
								<p className='mb-4 text-sm'>
									<span className='font-bold'>{uniqueInvestors} investors</span>{" "}
									have backed this project.
								</p>
							)}
							<InvestButton id={project.id} />
						</div>
					)}
				</div>
			) : (
				<Loading message='Loading project details...' />
			)}
		</div>
	);
};

export default ProjectDetails;
