import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import moment from "moment";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { v4 as uuidv4 } from "uuid";
import MilestoneForm from "@/components/MilestoneForm";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { BiPencil, BiTrash } from "react-icons/bi";

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

	const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
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
		const { data, error } = await supabase
			.from("project_milestones")
			.insert([
				{
					id: uuidv4(),
					project_id: projectId,
					title: title,
					short_description: shortDescription,
					body: DOMPurify.sanitize(body),
				},
			])
			.select();
		if (error) {
			console.error("Error creating milestone:", error);
			toast.error(error.message);
		}
		if (data) {
			toast.success("Milestone created!");
			return data[0] as ProjectMilestone;
		}
	};

	const handleCreateMilestone = () => {
		// Replace createMilestone with your function name.
		if (project?.id) {
			createMilestone(project?.id)
				.then((newMilestone) => {
					if (milestones && newMilestone) {
						setMilestones([...milestones, newMilestone]);
					}
				})
				.catch((error) => {
					console.log(`Failed to create milestone: ${error}`);
				});
		}
	};
	const updateMilestone = async (milestoneId: string) => {
		const { data, error } = await supabase
			.from("project_milestones")
			.update({
				title: title,
				short_description: shortDescription,
				body: DOMPurify.sanitize(body),
			})
			.eq("id", milestoneId)
			.select();
		if (error) {
			console.error("Error updating milestone:", error);
			toast.error(error.message);
		}
		if (data) {
			setOpenCreateModal(false);
			toast.success("Milestone updated!");
			return data[0] as ProjectMilestone;
		}
	};
	const handleUpdateMilestone = () => {
		// Replace updateMilestone with your function name.
		updateMilestone(selectedMilestone.id)
			.then((updatedMilestone) => {
				if (milestones && updatedMilestone)
					setMilestones(
						milestones.map((milestone) =>
							milestone.id === updatedMilestone.id
								? updatedMilestone
								: milestone
						)
					);
			})
			.catch((error) => {
				console.log(`Failed to update milestone: ${error}`);
			});
	};

	const deleteMilestone = async (milestoneId: string) => {
		const { data, error } = await supabase
			.from("project_milestones")
			.update({ is_deleted: true })
			.eq("id", milestoneId);
		if (error) {
			console.error("Error deleting milestone:", error);
			toast.error(error.message);
		}
		if (data) {
			toast.success("Milestone deleted!");
			return data[0];
		}
	};
	const handleDeleteMilestone = (milestoneId: string) => {
		// Replace deleteMilestone with your function name.
		deleteMilestone(milestoneId)
			.then(() => {
				setMilestones(
					milestones.filter((milestone) => milestone.id !== milestoneId)
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
				<h2 className='font-bold text-2xl mb-2'>Milestones</h2>
				{adminMode && (
					<>
						<button
							onClick={handleOpenCreateModal}
							className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600'
						>
							+ Milestone
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
			<hr />
			{milestones &&
				milestones.map((milestone) => {
					if (milestone.isDeleted) return null;
					const cleanHtml = DOMPurify.sanitize(milestone.body);
					return (
						<div key={milestone.id}>
							<div className='dark:border-white dark:border-[1px] rounded mt-2 p-2 flex justify-between'>
								<div>
									<h3 className='font-bold text-xl '>{milestone.title}</h3>
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
		</div>
	);
}
