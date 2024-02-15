"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import { IoMdAddCircle } from "react-icons/io";
import Loading from "@/components/Loading";
import axios from "axios";
type Props = {};
function Projects({}: Props) {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user); // Assuming you have a userContext reducer
	const [projects, setProjects] = useState<
		Project[] | TreeProject[] | EnergyProject[] | SolarProject[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [percentagesFunded, setPercentagesFunded] = useState<any>([]);

	const fetchProjects = async () => {
		setLoading(true);

		await axios
			.post("/api/p/projects", { producerId: user.producerId })
			.then((res) => {
				setLoading(false);
				setProjects(convertToCamelCase(res.data.data) as Project[]);
			})
			.catch((error) => {
				setLoading(false);
				console.error("Error fetching projects:", error);
			});
	};

	useEffect(() => {
		if (user) {
			fetchProjects();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	useEffect(() => {
		if (projects.length > 0) {
			setPercentagesFunded(
				projects.map((project) => {
					return (
						(project?.projectFinancials?.totalAmountRaised /
							project?.projectFinancials?.finalEstProjectFundRequestTotal) *
						100
					);
				})
			);
		}
	}, [projects]);
	if (loading)
		return (
			<div className='flex flex-col justify-center h-[80vh] items-center'>
				<Loading message='Loading your projects...' />
			</div>
		);
	return (
		<div className='m-4 w-[80%] mx-auto'>
			<div className='flex justify-between items-center my-6'>
				<h1 className='font-bold text-2xl md:text-3xl'>Your Projects</h1>
				<button
					onClick={() => router.push("/p/add-project")}
					className='flex py-2 px-4 md:px-8 border-none rounded-md bg-[var(--cta-one)] text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--cta-one-hover)]'
				>
					<IoMdAddCircle className='text-2xl mr-2' /> Project
				</button>
			</div>
			<div className='flex flex-wrap'>
				{projects.length > 0 ? (
					projects.map((project, index) => {
						const {
							id,
							projectCoordinatorContact,
							treeProjects,
							energyProjects,
							solarProjects,
						} = project;
						return (
							<ProjectCard
								key={id}
								projectCoordinatorContactName={projectCoordinatorContact.name}
								projectCoordinatorContactPhone={projectCoordinatorContact.phone}
								role='owner'
								project={project}
								treeProjects={treeProjects}
								energyProjects={energyProjects}
								solarProjects={solarProjects}
								fetchProjects={fetchProjects}
								percentageFunded={percentagesFunded[index]}
							/>
						);
					})
				) : (
					<div className='flex flex-col md:flex-row justify-center items-center mx-auto h-[80vh]'>
						<p className='text-center mb-4 md:mb-0 md:mr-4'>
							You have no projects yet. Add a new project today!
						</p>
						<button
							onClick={() => router.push("/p/add-project")}
							className='flex bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
						>
							<IoMdAddCircle className='text-2xl mr-2' /> Project
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
export default withAuth(Projects);
