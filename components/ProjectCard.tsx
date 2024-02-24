"use client";
import React, { useState, useEffect } from "react";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import axios from "axios";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineError } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { LinearProgress } from "@mui/material";
type Props = {
	project: Project;
	projectId?: string;
	role: string;
	projectCoordinatorContactName: string;
	projectCoordinatorContactPhone: string;

	treeProjects?: TreeProject;
	energyProjects?: EnergyProject;
	solarProjects?: SolarProject[];
	fetchProjects?: () => void;
	percentageFunded?: number;
};
function removeUnderscores(str: string) {
	let newStr = str.replace(/_/g, " ");
	return newStr;
}
const ProjectCard = ({
	role,
	project,
	fetchProjects,
	percentageFunded,
}: Props) => {
	const {
		title,
		description,
		imageUrls,
		id,
		status,
		type,
		createdAt,
		isVerified,
		isNonProfit,
		solarProjects,
		energyProjects,
		treeProjects,
		projectFinancials,
		externalUrl,
	} = project;
	const projectId = id;

	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const router = useRouter();
	// const [favoriteCount, setFavoriteCount] = useState<number>(0);

	const user = useAppSelector((state) => state.user);

	// Opens the edit project page
	const handleEdit = () => {
		// Navigate to the edit project page
		router.push(`/p/projects/${projectId}/edit`);
	};

	const userName = user?.name;
	// Publishes the project with the given ID
	const publishProject = async (projectId: string) => {
		if (!isVerified) return;
		if (!fetchProjects) return;
		try {
			axios
				.put(`/api/projects/publish`, {
					status,
					projectId,
				})
				.then(() => {
					fetchProjects();
					toast.success("Project published successfully");
				});
		} catch (error: any) {
			// Handle the error appropriately
			console.error("Error publishing project:", error.message);
			toast.error(`Failed to publish the project ${error.message}`);
		}
	};

	// Initiates the publish project flow
	const handlePublish = async () => {
		if (!projectId) return;
		await publishProject(projectId);
		setMenuOpen(false);
		toast.info("Publishing Project...");
	};

	const handleViewProjectClick = () => {
		if (role === "investor") router.push(`/i/projects/${projectId}`);
		if (role === "owner") router.push(`/p/projects/${projectId}`);
	};

	const theme = useAppSelector((state) => state.user?.currentTheme);

	const handleKnowMoreClick = () => router.push(`/i/projects/${projectId}`);
	const handleInvestClick = () => {
		if (externalUrl) {
			return router.push(externalUrl);
		} else {
			router.push(`/i/projects/${projectId}/invest`);
		}
	};

	const [requestedDollarsPerKwh, setRequestedDollarsPerKwh] = useState(0);

	// Set the card banner image
	const [bannerUrl, setBannerUrl] = useState("");
	useEffect(() => {
		// look through imageUrls and find the one with isBanner = true and run setBannerUrl to set it to that image
		if (!imageUrls) return;
		let bannerFound = false;
		imageUrls?.forEach((image) => {
			console.log("image", image);
			if (image.isBanner) {
				setBannerUrl(image.url);
				bannerFound = true;
			}
		});
		// If no banner is found, set the banner to the first image in the array
		if (!bannerFound && imageUrls.length > 0) {
			setBannerUrl(imageUrls[0].url);
		}
	}, [imageUrls]);

	// TODO:
	// Future features for reporting & bookmarking projects
	//
	//
	// const [isFavorited, setIsFavorited] = useState(false);
	// const [isFavIconHovered, setIsFavIconHovered] = useState(false);
	// const handleReport = async () => {};
	// const handleOnMouseEnter = () => setIsFavIconHovered(true);
	// const handleOnMouseLeave = () => setIsFavIconHovered(false);
	// Toggles the favorite status of the project
	// const toggleFavorite = async (event: React.MouseEvent) => {
	// 	event.stopPropagation();
	// 	setIsFavorited(!isFavorited);
	// 	if (isFavorited) {
	// 		// Delete a favorite
	// 		await axios
	// 			.delete(
	// 				`/api/project/favorite?projectId=${projectId}&userId=${user.id}`
	// 			)
	// 			.then((res) => {
	// 				if (res.data) {
	// 					setFavoriteCount(favoriteCount - 1);
	// 					toast.success("Removed from favorites");
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				toast.error(error.message);
	// 			});
	// 	} else {
	// 		// Add a favorite
	// 		await axios
	// 			.post("/api/project/favorite", { projectId, userId: user.id })
	// 			.then((res) => {
	// 				if (res.data) {
	// 					setFavoriteCount(favoriteCount + 1);
	// 					toast.success("Added to favorites");
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				toast.error(error.message);
	// 			});
	// 	}
	// };

	// useEffect(() => {
	// 	// Check if the project is favorited
	// 	const checkFavorite = async () => {
	// 		await axios
	// 			.get(`/api/project/favorite?projectId=${projectId}&userId=${user.id}`)
	// 			.then((res) => {
	// 				if (res.data.favorited) {
	// 					setIsFavorited(true);
	// 				}
	// 				setFavoriteCount(res.data.count);
	// 			})
	// 			.catch((error) => {
	// 				toast.error(error.message);
	// 			});
	// 	};
	// 	checkFavorite();
	// }, [projectId, user.id]);

	// role and status handling to only render published projects
	if (role === "investor" && status === "pending_verification") return null;
	if (role === "investor" && status === "pending_reverification") return null;
	if (role === "investor" && status === "not_approved") return null;
	if (role === "investor" && status === "draft") return null;
	if (role === "investor" && !isVerified) return null;
	if (role === "investor" && status === "published")
		return (
			<div className='mb-8 md:w-[300px] w-[408px]  bg-transparent rounded-2xl shadow-md relative md:mr-4 z-10 h-fit  '>
				<a className='block text-inherit no-underline'>
					<Link
						href={`/i/projects/${projectId}`}
						passHref
					>
						<div>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<Image
								width={288}
								height={150}
								className='w-full h-48 object-cover rounded-2xl relative'
								src={bannerUrl}
								alt={title}
							/>
							<div className='absolute inset-2 flex z-10 justify-end h-12 w-[95%]'>
								{type === "Energy" ? "" : type === "Tree" ? "🌳" : null}
								{energyProjects && energyProjects.type === "Solar" && "☀️"}
								{isNonProfit && "💚"}
							</div>
						</div>
					</Link>
					{/* <button className='bg-transparent absolute top-2 right-1 border-none cursor-pointer text-red-500 text-right mr-2 text-5xl'>
						{isFavorited || isFavIconHovered ? (
							<AiFillHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 1 : 0 }}
							/>
						) : (
							<AiOutlineHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 0 : 1 }}
							/>
						)}
					</button> */}
					{/* <p className='text-white absolute top-6 right-6 font-bold text-lg text-shadow-md'>
						{favoriteCount}
					</p> */}

					<div className='pt-[4px]'>
						{percentageFunded && percentageFunded >= 0 ? (
							<div className='my-2'>
								{project?.projectFinancials?.totalAmountRaised &&
									project?.projectFinancials
										?.finalEstProjectFundRequestTotal && (
										<p className='text-right text-sm mb-[2px] font-semibold tracking-wide'>
											$
											{project?.projectFinancials?.totalAmountRaised?.toLocaleString()}{" "}
											raised out of $
											{project?.projectFinancials?.finalEstProjectFundRequestTotal?.toLocaleString()}
										</p>
									)}
								<div>
									<LinearProgress
										variant='determinate'
										color='success'
										value={percentageFunded}
									/>
									<p className='text-xs text-right mt-[2px] tracking-wide text-gray-300'>
										{percentageFunded.toFixed(2)}% Funded
									</p>
								</div>
							</div>
						) : (
							<div className='my-2'>
								<p className='text-right text-sm mb-[2px] font-semibold tracking-wide'>
									$0 raised out of $
									{project?.projectFinancials?.finalEstProjectFundRequestTotal?.toLocaleString()}
								</p>

								<div>
									<LinearProgress
										variant='determinate'
										color='success'
										value={0}
									/>
									<p className='text-xs text-right mt-[2px] tracking-wide text-gray-300'>
										0.00% Funded
									</p>
								</div>
							</div>
						)}
						<div className='flex justify-between'>
							<div className='flex flex-col '>
								<Link
									href={`/i/projects/${projectId}`}
									passHref
								>
									<h3 className='font-bold text-xl overflow-hidden overflow-ellipsis'>
										{title}
									</h3>
								</Link>
							</div>
							<div className='flex justify-between mr-[4px]'>
								<div
									onClick={handleClick}
									className='cursor-pointer text-2xl dark:text-white text-gray-800 mr-[-12px] '
								>
									<BsThreeDotsVertical />
								</div>
								<Menu
									id='basic-menu'
									className=''
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
									MenuListProps={{
										"aria-labelledby": "basic-button",
									}}
									disableScrollLock={true}
									sx={
										theme === "dark"
											? {
													"& .MuiPaper-root": {
														backgroundColor: "rgb(5 46 22 / 98%)",
														borderColor: "rgb(20 83 45 / 90%)",
														borderWidth: "2px",
													},
											  }
											: {
													"& .MuiPaper-root": {
														backgroundColor: "",
													},
											  }
									}
								>
									<MenuItem
										className='menu-link'
										onClick={handleKnowMoreClick}
									>
										View
									</MenuItem>
									{/* <MenuItem
										className='menu-link'
										onClick={() =>
											router.push(`/i/projects/${projectId}/report`)
										}
									>
										Report
									</MenuItem> */}
								</Menu>
							</div>
						</div>

						<div className='flex'>
							<Link
								href={`/i/projects/${projectId}`}
								passHref
								className='flex flex-[3] flex-col '
							>
								<p className='w-[90%] text-xs text-gray-400 overflow-hidden'>
									{description.substring(0, 30)}
									<span className='ml-[-2px]'>
										{description.length > 30 && "..."}
									</span>
								</p>

								{treeProjects && (
									<div className=''>
										<p className='text-xs text-gray-400 mr-[4px]'>
											{treeProjects.projectType === "Restoration"
												? `Non-profit • Restoration •`
												: `${treeProjects.projectType} •`}{" "}
											Target →
											{Number(treeProjects.treeTarget).toLocaleString("en-US")}{" "}
											Trees • Requested ${treeProjects.fundsRequestedPerTree}{" "}
											per Tree{" "}
											{projectFinancials.totalNumberOfInvestors !==
												undefined && (
												<>
													{projectFinancials.totalNumberOfInvestors === 1
														? "• 1 Investor"
														: `• ${projectFinancials.totalNumberOfInvestors} Investors`}{" "}
												</>
											)}
										</p>
									</div>
								)}

								{energyProjects && solarProjects && (
									<div className='flex items-center'>
										<p className='text-xs text-gray-400 mr-[4px]'>
											{isNonProfit
												? `Non-profit • ${solarProjects[0].locationType} • `
												: `${solarProjects[0].locationType} •`}{" "}
											Target →{" "}
											{Number(
												solarProjects[0].estYearlyOutputInKwh
											).toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}{" "}
											kwh/yr •{" "}
											{projectFinancials.totalNumberOfInvestors !==
												undefined && (
												<>
													{projectFinancials.totalNumberOfInvestors === 1
														? "1 Investor"
														: `${projectFinancials.totalNumberOfInvestors} Investors`}{" "}
												</>
											)}
										</p>
									</div>
								)}
							</Link>
							<div className='flex flex-1 flex-col mt-2'>
								<button
									onClick={handleKnowMoreClick}
									className={`text-xs w-[100%] px-2 py-[4px] mb-2 border-none rounded-md bg-[var(--cta-one)] text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--cta-one-hover)]`}
								>
									Details
								</button>
								{project.producerId !== user.producerId ? (
									<button
										onClick={handleInvestClick}
										className='text-xs w-[100%] px-2 py-[4px] border-none rounded-md bg-[var(--cta-one)] text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--cta-one-hover)]'
									>
										Invest
									</button>
								) : null}
							</div>
						</div>
					</div>
				</a>
			</div>
		);

	if (role === "owner")
		return (
			<div className='mb-4 lg:w-[308px] w-[408px]  bg-transparent rounded-2xl shadow-md relative md:mr-4 z-10 h-fit'>
				<div>
					<Link
						href={`/p/projects/${projectId}`}
						passHref
						className='h-[max-content] w-[max-content]'
					>
						<div>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<Image
								width={288}
								height={150}
								src={bannerUrl}
								alt={title}
								className='w-full h-48 object-cover rounded-2xl relative'
							/>
							<div className='absolute inset-2 flex z-10 justify-end h-12 w-[95%]'>
								{type === "Energy" ? "⚡" : type === "Tree" ? "🌳" : null}
								{isNonProfit && "💚"}
							</div>
						</div>
					</Link>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
						sx={
							theme === "dark"
								? {
										"& .MuiPaper-root": {
											backgroundColor: "#0C2100",
											borderColor: "rgb(20 83 45 / 90%)",
											borderWidth: "2px",
											color: "white",
										},
										"& .css-6hp17o-MuiList-root-MuiMenu-list": {
											paddingTop: "0px",
											paddingBottom: "0px",
											padding: "4px",
										},
								  }
								: {
										"& .MuiPaper-root": {
											backgroundColor: "",
										},
								  }
						}
					>
						<MenuItem
							onClick={handleViewProjectClick}
							className='hover:bg-[var(--cta-one)] transition-colors'
						>
							View
						</MenuItem>
						{status === "approved" && (
							<MenuItem
								onClick={handlePublish}
								className='hover:bg-[var(--cta-one)] transition-colors'
							>
								Publish
							</MenuItem>
						)}
						<MenuItem
							onClick={handleEdit}
							className='hover:bg-[var(--cta-one)] transition-colors'
						>
							Edit
						</MenuItem>
					</Menu>
				</div>
				<div className='mt-[4px]'>
					{" "}
					{percentageFunded && percentageFunded >= 0 ? (
						<div className='my-2'>
							{project?.projectFinancials?.totalAmountRaised &&
								project?.projectFinancials?.finalEstProjectFundRequestTotal && (
									<p className='text-right text-sm mb-[2px] font-semibold tracking-wide'>
										$
										{project?.projectFinancials?.totalAmountRaised?.toLocaleString()}{" "}
										raised out of $
										{project?.projectFinancials?.finalEstProjectFundRequestTotal?.toLocaleString()}
									</p>
								)}
							<div>
								<LinearProgress
									variant='determinate'
									color='success'
									value={percentageFunded}
								/>
								<p className='text-xs text-right mt-[2px] tracking-wide text-gray-300'>
									{percentageFunded.toFixed(2)}% Funded
								</p>
							</div>
						</div>
					) : (
						<div className='my-2'>
							<p className='text-right text-sm mb-[2px] font-semibold tracking-wide'>
								$0 raised out of $
								{project?.projectFinancials?.finalEstProjectFundRequestTotal?.toLocaleString()}
							</p>

							<div>
								<LinearProgress
									variant='determinate'
									color='success'
									value={0}
								/>
								<p className='text-xs text-right mt-[2px] tracking-wide text-gray-300'>
									0.00% Funded
								</p>
							</div>
						</div>
					)}
					<div className='flex justify-between items-center w-[100%]'>
						<h3 className='overflow-hidden overflow-ellipsis flex '>
							<Link
								href={`/p/projects/${projectId}`}
								className='no-underline cursor-pointer h-[max-content] w-[max-content]'
							>
								<span className='flex-[10] font-semibold text-lg'>{title}</span>
							</Link>
							<span
								className={`bg-transparent border-none cursor-help ${
									status === "approved"
										? "text-green-300 text-2xl"
										: status === "published"
										? "text-green-500 text-2xl"
										: "text-red-400 text-2xl"
								} ml-2 mt-[2px] font-bold flex-[0.5]`}
							>
								{status === "approved" || status === "published" ? (
									<IoCheckmarkCircle
										data-tooltip-id='tooltip'
										data-tooltip-content={removeUnderscores(status)}
									/>
								) : (
									<MdOutlineError
										data-tooltip-id='tooltip'
										data-tooltip-content={status}
									/>
								)}
							</span>
						</h3>

						<Tooltip id='tooltip' />
						<div>
							<button
								className='cursor-pointer text-2xl mt-[2px] mr-[-2px]'
								onClick={handleClick}
							>
								<BsThreeDotsVertical />
							</button>
						</div>
					</div>
					<Link
						href={`/p/projects/${projectId}`}
						className='no-underline cursor-pointer h-[max-content] w-[max-content]'
					>
						<p className='text-xs text-gray-400'>
							{treeProjects
								? `${
										treeProjects.projectType === "Restoration"
											? `Non-profit • Restoration`
											: treeProjects.projectType
								  }`
								: null}
							{energyProjects && solarProjects
								? `${
										isNonProfit
											? `Non-profit • ${solarProjects[0].locationType}`
											: solarProjects[0].locationType
								  }`
								: null}{" "}
							{projectFinancials.totalNumberOfInvestors === null ? (
								`• 0 Investors`
							) : (
								<span className='text-xs text-gray-400 mt-[2px]'>
									{projectFinancials.totalNumberOfInvestors === 1
										? "• 1 Investor"
										: `• ${projectFinancials.totalNumberOfInvestors} Investors`}{" "}
								</span>
							)}
						</p>

						{treeProjects && (
							<div className='flex'>
								<p className='text-xs text-gray-400 mr-[4px]'>
									Target →{" "}
									{Number(treeProjects.treeTarget).toLocaleString("en-US")}{" "}
									Trees •{" "}
								</p>
								<p className='text-xs text-gray-400'>
									{" "}
									Requested ${treeProjects.fundsRequestedPerTree} per Tree
								</p>
							</div>
						)}
						{energyProjects && solarProjects && (
							<div className='flex'>
								<p className='text-xs text-gray-400 mr-[4px]'>
									Target →{" "}
									{Number(solarProjects[0].estYearlyOutputInKwh).toLocaleString(
										"en-US",
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}
									)}{" "}
									kwh/yr •{" "}
								</p>
								<p className='text-xs text-gray-400'>
									{" "}
									Requested ${energyProjects.fundsRequestedPerKwh.toFixed(2)}
									/kwh
								</p>
							</div>
						)}

						<span className='text-xs text-gray-400'>
							Created {moment(createdAt).format("dddd, MMMM Do YYYY")}
						</span>
					</Link>
				</div>
			</div>
		);
};

export default ProjectCard;
