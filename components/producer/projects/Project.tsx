"use client";
import moment from "moment";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import TreeProject from "./TreeProject";
import EnergyProject from "./EnergyProject";
import { toast } from "react-toastify";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "@/redux/hooks";
import { BiPencil, BiTrashAlt } from "react-icons/bi";
import Milestones from "./Milestones";
import { useRouter } from "next/navigation";
import Modal from "@mui/material/Modal";
import { Box, LinearProgress, useMediaQuery } from "@mui/material";
import { RootState } from "@/redux/store";
import { FaAngleDown } from "react-icons/fa";
import axios from "axios";
type Props = {
	project: Project | null | undefined;
	fetchProject?: () => void;
	adminMode: boolean;
	percentageFunded?: number;
};

export default function Project({
	project,
	fetchProject,
	adminMode,
	percentageFunded,
}: Props) {
	// Visibility Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const router = useRouter();
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const matches = useMediaQuery("(min-width: 768px)");
	const role = useAppSelector((state: RootState) => state.user?.activeRole);
	const theme = useAppSelector((state: RootState) => state.user?.currentTheme);
	const [openModal, setOpenModal] = useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		background: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	function removeUnderscores(str: string) {
		let newStr = str.replace(/_/g, " ");
		return newStr;
	}
	const toggleProjectVisibility = async () => {
		if (!project?.isVerified) return;
		if (!fetchProject) return;
		axios
			.put("/api/projects/", {
				projectId: project?.id,
				status: project?.status === "approved" ? "published" : "approved",
			})
			.then((res) => {
				handleClose();
				toast.success("Project updated");
				fetchProject();
			})
			.catch((err) => {
				handleClose();
				console.log("error updating project >>> ", err);
				toast.error("Error updating project");
			});
	};
	const handleEdit = () => {
		router.push(`/p/projects/${project?.id}/edit`);
	};
	const handleDelete = async () => {
		if (!checkIfProjectIsDeletable()) return;
		if (!fetchProject) return;

		await axios
			.delete(
				`/api/projects?projectId=${project?.id}&projectType=${project?.type}`
			)
			.then((res) => {
				toast.success("Project deleted");
				fetchProject();
				handleGoBack();
			})
			.catch((err) => {
				console.log("error deleting project >>> ", err);
				toast.error(err.message);
			});
	};
	const checkIfProjectIsDeletable = () => {
		if (
			!project?.energyInvestments ||
			project.energyInvestments.length === 0 ||
			((!project?.treeInvestments || project.treeInvestments.length === 0) &&
				(project?.status === "draft" ||
					project?.status === "pending_verification" ||
					project?.status === "pending_reverification" ||
					project?.status === "not_approved" ||
					project?.status === "approved" ||
					project?.status === "published"))
		) {
			return true;
		} else {
			toast.error(
				"Project cannot be deleted, please make sure it is private or all investors have withdrawn their investments. Contact support if you need further assistance."
			);
			return false;
		}
	};
	const [deleteConfirm, setDeleteConfirm] = useState("");
	const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
	const handleDeleteConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDeleteConfirm(e.target.value);
	};
	// Here we have a use effect that checks if deleteConfirm is equal to the project title, if it is, then the delete button is enabled, otherwise it is disabled.
	useEffect(() => {
		if (deleteConfirm === project?.title) {
			setDeleteButtonDisabled(false);
		} else {
			setDeleteButtonDisabled(true);
		}
	}, [deleteConfirm, project?.title]);

	const handleGoBack = () => {
		router.back();
	};
	return (
		<div>
			<div className='flex items-center justify-between'>
				<p
					onClick={handleGoBack}
					className='cursor-pointer mb-4 text-sm font-semibold transition-colors text-gray-400 hover:text-[var(--cta-two-hover)] w-[max-content]'
				>
					{role === "investor"
						? `← Back to projects`
						: role === "producer"
						? `← Back to my projects`
						: `← Back`}
				</p>
				{adminMode && (
					<div className='flex justify-end mb-2'>
						<button
							onClick={handleEdit}
							className='p-2 rounded bg-[var(--cta-one)] text-white font-bold transition-colors hover:bg-[var(--cta-one-hover)]'
						>
							<BiPencil className='text-2xl' />
						</button>
						<button
							onClick={handleOpenModal}
							className='p-2 rounded bg-red-700 text-white font-bold transition-colors hover:bg-red-600 ml-2'
						>
							<BiTrashAlt className='text-2xl' />
						</button>
						<Modal
							open={openModal}
							onClose={handleCloseModal}
							aria-labelledby='modal-modal-title'
							aria-describedby='modal-modal-description'
						>
							<Box sx={style}>
								<p>Are you sure you want to delete this project?</p>
								<p>
									Note: Any project investments made by investors must be
									returned to the original investor before deleting.
								</p>
								<div className='flex flex-col mt-4'>
									<p>
										Type &quot;{project?.title}&quot; to delete this project.
									</p>
									<input
										value={deleteConfirm}
										onChange={handleDeleteConfirm}
										className='border-2 border-gray-300 rounded-md p-2 w-auto my-2'
									/>
									<button
										disabled={deleteButtonDisabled}
										className={
											deleteButtonDisabled
												? "text-sm p-2 rounded bg-gray-400 text-white font-bold transition-colors cursor-default"
												: "text-sm p-2 rounded bg-red-700 text-white font-bold transition-colors hover:bg-red-600"
										}
										onClick={handleDelete}
									>
										Delete project
									</button>
								</div>
							</Box>
						</Modal>
					</div>
				)}
			</div>
			{matches ? (
				<Image
					className='w-full h-64 object-cover object-top mb-4 rounded-xl'
					src={
						project?.imageUrl
							? project?.imageUrl
							: "https://via.placeholder.com/1500x500"
					}
					alt='Banner'
					width={1500}
					height={500}
				/>
			) : (
				<Image
					src={
						project?.imageUrl
							? project?.imageUrl
							: "https://via.placeholder.com/1500x500"
					}
					alt='Banner'
					width={288}
					height={150}
					className='w-full h-48 object-cover rounded-2xl relative'
				/>
			)}
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
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-semibold tracking-wide '>
					{project?.title} - {project?.type} Project
				</h2>
				{adminMode && (
					<div>
						{(project?.isVerified && project?.status === "approved") ||
						(project?.isVerified && project?.status === "published") ? (
							<div className='cursor-pointer text-sm px-6 py-2 border-white rounded border-[1px]'>
								<div
									className=' flex'
									id='basic-button'
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup='true'
									aria-expanded={open ? "true" : undefined}
									onClick={handleClick}
								>
									{removeUnderscores(project?.status)}{" "}
									<FaAngleDown className='text-2xl ml-2' />
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
														backgroundColor: "rgb(12 33 0 / 90%)",
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
										onClick={toggleProjectVisibility}
									>
										{project?.status === "approved" ? "Publish" : "Unpublish"}
									</MenuItem>
								</Menu>
							</div>
						) : (project?.status === "pending_verification" &&
								!project?.isVerified) ||
						  (project?.status === "pending_reverification" &&
								!project?.isVerified) ? (
							<div className='cursor-pointer text-xs px-6 py-2 border-white rounded border-[1px]'>
								{removeUnderscores(project?.status)} & strategy call
							</div>
						) : project?.status === "pending_verification" ||
						  project?.status === "pending_reverification" ? (
							<div className='cursor-pointer text-xs px-6 py-2 border-white rounded border-[1px]'>
								{removeUnderscores(project?.status)}
							</div>
						) : null}
					</div>
				)}
			</div>
			<hr className='dark:border-gray-700 my-3' />
			<div className='flex flex-col md:flex-row justify-between'>
				<div className='mb-4 md:mb-0'>
					<p className='mb-2'>
						<span className='text-gray-400'>Coordinator:</span>{" "}
						{project?.projectCoordinatorContact?.name},{" "}
						{project?.projectCoordinatorContact?.phone}
					</p>
					<p className='mb-2'>
						<span className='text-gray-400'>Address:</span>{" "}
						{project?.producerProperties?.address?.addressLineOne}
					</p>
					<p className='mb-2'>
						<span className='text-gray-400'>Area:</span>{" "}
						{project?.totalAreaSqkm} sq km
					</p>
					<p className='mb-2'>
						<span className='text-gray-400'>Description:</span> <br />
						{project?.description}
					</p>
					{/* <p>Funds collected: ${project?.fundsCollected}</p> */}
					{/* <p>Investors: {project?.investorCount}</p> */}
					<p className='mb-2 text-gray-400 text-xs'>
						Created at{" "}
						{moment(project?.createdAt).format("LT on MMMM DD, yyyy")}
					</p>
					<p className='mb-2 text-gray-400 text-xs'>
						Last updated at{" "}
						{project?.updatedAt
							? moment(project?.updatedAt).format("LT on MMMM DD, yyyy")
							: moment(project?.createdAt).format("LT on MMMM DD, yyyy")}
					</p>
				</div>
				{project?.type === "Tree" ? (
					<TreeProject
						treeProject={project?.treeProjects}
						project={project}
					/>
				) : project?.type === "Energy" ? (
					<>
						<EnergyProject
							project={{
								entireProject: project,
								energyProjects: project?.energyProjects,
								solarProjects: project?.solarProjects,
							}}
						/>
					</>
				) : null}
			</div>
			<Milestones
				project={project}
				adminMode={adminMode}
			/>
		</div>
	);
}
