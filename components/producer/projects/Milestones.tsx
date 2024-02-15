import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import moment from "moment";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { v4 as uuidv4 } from "uuid";
import MilestoneForm from "@/components/MilestoneForm";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { BiPencil, BiTrash } from "react-icons/bi";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import { IoAddCircle } from "react-icons/io5";
type Props = {
	project: Project | null | undefined;
	adminMode: boolean;
};

export default function Milestones({ project, adminMode }: Props) {
	const theme = useAppSelector((state: RootState) => state.user?.currentTheme);
	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	const createModalStyle = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "60vw",
		background: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	const [milestones, setMilestones] = useState<any>([]);
	const [selectedMilestone, setSelectedMilestone] = useState({
		id: "",
		createdAt: "",
		updatedAt: "",
		title: "",
		shortDescription: "",
		body: "",
		isDeleted: false,
		deletedAt: "",
		projectId: "",
	});
	const [newMilestoneData, setNewMilestoneData] = useState({
		id: "",
		createdAt: "",
		updatedAt: "",
		title: "",
		shortDescription: "",
		body: "",
		isDeleted: false,
		deletedAt: "",
		projectId: "",
	});
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const handleOpenDeleteModal = () => setOpenDeleteModal(true);
	const handleCloseDeleteModal = () => setOpenDeleteModal(false);

	const [shortDescription, setShortDescription] = useState("");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	useEffect(() => {
		if (project) {
			setMilestones(project.projectMilestones);
		}
	}, [project]);

	const [openCreateModal, setOpenCreateModal] = useState(false);
	const handleOpenCreateModal = () => setOpenCreateModal(true);
	const handleCloseCreateModal = () => setOpenCreateModal(false);
	useEffect(() => {
		if (project) {
			setMilestones(project.projectMilestones);
		}
	}, [project]);

	const createMilestone = async (projectId: string) => {
		const cleanBody = DOMPurify.sanitize(body);
		await axios
			.post(`/api/milestones/create`, {
				projectId,
				title,
				shortDescription,
				cleanBody,
			})
			.then((res) => {
				if (res.data) {
					toast.success("Milestone created!");
					setMilestones([...milestones, res.data[0]]);
					return res.data[0] as ProjectMilestone;
				}
			})
			.catch((err) => {
				console.log("Error creating milestone: ", err);
				toast.error(err.message);
			});
	};

	const handleCreateMilestone = () => {
		if (project?.id) {
			createMilestone(project?.id);
		}
	};

	const updateMilestone = async (milestoneId: string) => {
		await axios
			.put(`/api/milestones/update/${milestoneId}`, {
				title,
				shortDescription,
				body,
			})
			.then((res) => {
				if (res.data) {
					toast.success("Milestone updated!");
					setMilestones(
						milestones.map((milestone: any) =>
							milestone.id === res.data[0].id ? res.data[0] : milestone
						)
					);
				}
			})
			.catch((err) => {
				console.log("Error updating milestone: ", err);
				toast.error(err.message);
			});
	};

	const handleUpdateMilestone = () => {
		// Replace updateMilestone with your function name.
		updateMilestone(selectedMilestone.id);
	};

	const deleteMilestone = async (milestoneId: string) => {
		axios
			.delete(`/api/milestones/delete/${milestoneId}`)
			.then((res) => {
				if (res.data) {
					toast.success("Milestone deleted!");
					return res.data[0];
				}
			})
			.catch((err) => {
				console.log(`Failed to delete milestone: ${err}`);
			});
	};
	const handleDeleteMilestone = (milestoneId: string) => {
		// Replace deleteMilestone with your function name.
		deleteMilestone(milestoneId)
			.then(() => {
				setMilestones(
					milestones.filter((milestone: any) => milestone.id !== milestoneId)
				);
			})
			.catch((error: any) => {
				console.log(`Failed to delete milestone: ${error}`);
			});
	};

	const handleEditMilestoneClick = (id: string) => {
		setSelectedMilestone({
			...selectedMilestone,
			id,
		});
		handleOpen();
	};

	const handleDeleteMilestoneClick = (id: string) => {
		setSelectedMilestone({
			...selectedMilestone,
			id,
		});
		handleOpenDeleteModal();
	};

	return (
		<div className='mt-8'>
			<div className='flex justify-between mb-2'>
				<h2 className='font-semibold text-xl '>Milestones</h2>

				{adminMode && (
					<>
						<button
							onClick={handleOpenCreateModal}
							className='flex p-2 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)]'
						>
							<IoAddCircle className='text-2xl mr-2' /> Milestone
						</button>
						<Modal
							open={openCreateModal}
							onClose={handleCloseCreateModal}
							aria-labelledby='modal-modal-title'
							aria-describedby='modal-modal-description'
						>
							<Box sx={createModalStyle}>
								<MilestoneForm
									handleCreateMilestone={handleCreateMilestone}
									setBody={setBody}
									body={body}
									title={title}
									setTitle={setTitle}
									shortDescription={shortDescription}
									setShortDescription={setShortDescription}
									editingMilestone={false}
									handleUpdateMilestone={function (): void | undefined {
										throw new Error("Function not implemented.");
									}}
								/>
							</Box>
						</Modal>
					</>
				)}
			</div>
			{milestones &&
				milestones.map((milestone: any) => {
					if (milestone.isDeleted) return null;
					const cleanHtml = DOMPurify.sanitize(milestone.body);
					return (
						<div key={milestone.id}>
							<div className='text-gray-300 dark:border-green-900 dark:border-[1px] dark:bg-green-950 dark:bg-opacity-25 rounded  px-4 pt-2 pb-3 flex justify-between'>
								<div>
									<h3 className='font-bold text-xl text-gray-500'>
										{milestone.title}
									</h3>
									<p className='text-sm'>{milestone.shortDescription}</p>
									<div
										dangerouslySetInnerHTML={{ __html: cleanHtml }}
										className='text-sm'
									></div>
								</div>
								<div>
									{adminMode && (
										<div className='flex flex-col'>
											<button
												onClick={() => handleEditMilestoneClick(milestone.id)}
												className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 mb-[4px]'
											>
												<BiPencil />
											</button>
											<Modal
												open={open}
												onClose={handleClose}
												aria-labelledby='modal-modal-title'
												aria-describedby='modal-modal-description'
											>
												<Box sx={createModalStyle}>
													<MilestoneForm
														handleUpdateMilestone={handleUpdateMilestone}
														initialData={milestone}
														setBody={setBody}
														body={body}
														title={title}
														setTitle={setTitle}
														shortDescription={shortDescription}
														setShortDescription={setShortDescription}
														editingMilestone={true}
														handleCreateMilestone={function ():
															| void
															| undefined {
															throw new Error("Function not implemented.");
														}}
													/>
												</Box>
											</Modal>
											<button
												onClick={() => handleDeleteMilestoneClick(milestone.id)}
												className='p-2 rounded bg-red-700 text-white font-bold transition-all hover:bg-red-600'
											>
												<BiTrash />
											</button>
											<Modal
												open={openDeleteModal}
												onClose={handleCloseDeleteModal}
												aria-labelledby='modal-modal-title'
												aria-describedby='modal-modal-description'
											>
												<Box sx={style}>
													<h2 className='font-bold text-xl'>
														Are you sure you want to delete this milestone?
													</h2>
													<button
														onClick={() => handleDeleteMilestone(milestone.id)}
														className='p-2 rounded bg-red-600 text-white font-bold transition-all hover:bg-red-400'
													>
														Yes
													</button>
												</Box>
											</Modal>
										</div>
									)}
								</div>
							</div>
							<div className='flex justify-end mt-[2px] opacity-40'>
								<p className='text-xs'>
									Created {moment(milestone.createdAt).format("MMMM DD, YYYY")}
									{milestone.updatedAt && adminMode && (
										<>
											<span className='text-xs'>
												Last updated {moment(milestone.updatedAt).fromNow()}
											</span>
											<p className='text-xs'>Note: only you see this</p>
										</>
									)}{" "}
								</p>
							</div>
						</div>
					);
				})}
			{milestones?.length === 0 && <p>No milestones found.</p>}
		</div>
	);
}
