"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import withAuth from "@/utils/withAuth";
import convertToCamelCase from "@/utils/convertToCamelCase";
import axios from "axios";
import Loading from "@/components/Loading";
import { set } from "react-hook-form";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
type Filter = {
	label: string;
	value: string;
};
function Discover() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeFilter = searchParams?.get("filter") ?? "All";
	const [projects, setProjects] = useState<Projects>([]);
	const nonProfitFilter = searchParams?.get("nonProfit") ?? "false";
	const [loading, setLoading] = useState<boolean>(false);
	const user = useAppSelector((state: RootState) => state.user);
	const [filters, setFilters] = useState<Filter[]>([
		{ label: "All", value: "All" },
		{ label: "🌳 Timber / Lumber", value: "Timber / Lumber" },
		{ label: "🌳 Fruit", value: "Fruit" },
		{ label: "🌳 Nut", value: "Nut" },
		{ label: "🌳 Bio Fuel", value: "Bio Fuel" },
		{ label: "🌳 Pulp", value: "Pulp" },
		{ label: "🌳 Syrup", value: "Syrup" },
		{ label: "🌳 Oil / Chemical", value: "Oil / Chemical" },
		{ label: "☀️ Solar", value: "Solar" },
	]);
	const [percentagesFunded, setPercentagesFunded] = useState<any>([]);

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
	useEffect(() => {
		if (nonProfitFilter === "true") {
			// with restoration
			setFilters([
				{ label: "All", value: "All" },
				{ label: "🌳 Restoration", value: "Restoration" },
				{ label: "🌳 Timber / Lumber", value: "Timber / Lumber" },
				{ label: "🌳 Fruit", value: "Fruit" },
				{ label: "🌳 Nut", value: "Nut" },
				{ label: "🌳 Bio Fuel", value: "Bio Fuel" },
				{ label: "🌳 Pulp", value: "Pulp" },
				{ label: "🌳 Syrup", value: "Syrup" },
				{ label: "🌳 Oil / Chemical", value: "Oil / Chemical" },
				{ label: "☀️ Solar", value: "Solar" },
			]);
		} else {
			// without restoration
			setFilters([
				{ label: "All", value: "All" },
				{ label: "🌳 Timber / Lumber", value: "Timber / Lumber" },
				{ label: "🌳 Fruit", value: "Fruit" },
				{ label: "🌳 Nut", value: "Nut" },
				{ label: "🌳 Bio Fuel", value: "Bio Fuel" },
				{ label: "🌳 Pulp", value: "Pulp" },
				{ label: "🌳 Syrup", value: "Syrup" },
				{ label: "🌳 Oil / Chemical", value: "Oil / Chemical" },
				{ label: "☀️ Solar", value: "Solar" },
			]);
		}
	}, [nonProfitFilter]);

	// Here we fetch projects from app/api/projects/route.tsx
	useEffect(() => {
		setLoading(true);
		const fetchProjects = async (type: string, nonProfit: string) => {
			await axios
				.get(
					`/api/projects?type=${type}${
						nonProfit === "true" ? "&nonProfit=true" : ""
					}`,
					{ withCredentials: true } // Ensure cookies are sent with the request
				)
				.then((res) => {
					setProjects(convertToCamelCase(res.data));
					setLoading(false);
				})
				.catch((err) => {
					console.log("error fetching projects: ", err);
					setLoading(false);
				});
		};

		fetchProjects(activeFilter, nonProfitFilter);
	}, [activeFilter, nonProfitFilter]);
	// Here we handle the filter click by pushing the filter type to the url
	const handleFilterClick = (e: any) => {
		const filterType = e.target.value;
		if (filterType !== activeFilter) {
			if (filterType === "All") {
				if (nonProfitFilter === "true")
					router.push(`/i/discover?nonProfit=true`);
				else router.push(`/i/discover`);
			} else {
				if (nonProfitFilter === "true")
					router.push(`/i/discover?filter=${filterType}&nonProfit=true`);
				else router.push(`/i/discover?filter=${filterType}`);
			}
		}
	};

	const [nonProfit, setNonProfit] = useState<boolean>(false);

	const handleNonProfitFilterClick = () => {
		setNonProfit(!nonProfit);
		if (nonProfit) {
			if (activeFilter !== "All")
				router.push(`/i/discover?filter=${activeFilter}`);
			if (activeFilter === "All") router.push(`/i/discover`);
		} else {
			if (activeFilter !== "All")
				router.push(`/i/discover?filter=${activeFilter}&nonProfit=true`);
			if (activeFilter === "All") router.push(`/i/discover?nonProfit=true`);
		}
	};

	return (
		<div className='w-[90%] xl:w-[90vw] mx-auto py-8 h-[100%]'>
			<h1 className='text-2xl font-bold'>Discover Projects</h1>
			<h2 className='font-light text-lg mb-8'>
				Instantly find tree-based agriculture and renewable energy projects to
				invest into.
			</h2>
			<div className='flex flex-wrap gap-2 mb-8'>
				{filters.map((item, index) => (
					<button
						key={index}
						value={`${item.value}`}
						onClick={handleFilterClick}
						className={`text-xs md:text-base px-4 py-2 rounded transition-colors border border-black ${
							item.value === activeFilter
								? "bg-[var(--cta-one)] text-white"
								: "bg-gray-800 text-white hover:bg-gray-700 hover:text-[var(--cta-two-hover)]"
						}`}
					>
						{item.label}
					</button>
				))}
				<button
					onClick={handleNonProfitFilterClick}
					className={`text-xs md:text-base px-4 py-2 rounded transition-colors border border-black ${
						nonProfitFilter === "true"
							? "bg-[var(--cta-one)] text-white"
							: "bg-gray-800 text-white hover:bg-gray-700 hover:text-[var(--cta-two-hover)]"
					}`}
				>
					{`💚 Non-Profit`}
				</button>
			</div>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-wrap'>
					{projects.length > 0 ? (
						projects.map((project, index) => {
							const {
								id,
								projectCoordinatorContact,
								treeProjects,
								energyProjects,
							} = project;
							return (
								<ProjectCard
									key={id}
									project={project}
									projectId={id}
									role={"investor"}
									projectCoordinatorContactName={projectCoordinatorContact.name}
									projectCoordinatorContactPhone={
										projectCoordinatorContact.phone
									}
									treeProjects={treeProjects}
									energyProjects={energyProjects}
									percentageFunded={percentagesFunded[index]}
								/>
							);
						})
					) : (
						<div className='mx-auto flex flex-col items-center text-center mt-48'>
							<h3 className='mb-4'>
								No {nonProfitFilter === "true" ? "non-profit" : null}{" "}
								{activeFilter !== "All" ? activeFilter : null} Projects Found.
							</h3>{" "}
							<br />
							<p>
								<br /> Invite a{" "}
								{nonProfitFilter === "true" ? "non-profit" : null} Producer to
								join Eco Wealth or <br />
								become a Producer and start a{" "}
								{nonProfitFilter === "true" ? "non-profit" : null}{" "}
								{activeFilter !== "All" ? activeFilter : null} project today!
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default withAuth(Discover);
