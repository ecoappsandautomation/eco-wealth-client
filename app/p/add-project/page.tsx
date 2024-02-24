"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import { useForm } from "react-hook-form";
import axios, { all } from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Agreement from "@/components/producer/projects/Agreement";
import Switch from "react-switch";
import UrgentNotification from "@/components/UrgentNotification";
import { setProducer } from "@/redux/features/producerSlice";
import getBasePath from "@/lib/getBasePath";
import Loading from "@/components/Loading";
import { HiSwitchHorizontal } from "react-icons/hi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { v4 as uuid } from "uuid";
import ImageUpload from "@/components/ImageUpload";
import VideoUploadInput from "@/components/producer/projects/VideoUpload";
interface FormValues {
	title: string;
	image: File | null;
	coordinatorName: string;
	coordinatorPhone: string;
	description: string;
	numTrees: number;
	pricePerTree: number;
	projectType: string;
	agreements: boolean;
	imageFile: FileList | null;
	imageUrlInput: string;
	imageUrls: ImageUrls;
	videoUrls: string[];
	uploadMethod: boolean;
	treeProjectType: string;
	treeType: string;
	energyType: string;
	totalArea: number;
	properties: Property[]; // Replace 'Property' with the actual type
	projectAddressId: string;
	energyProductionTarget: number;
	numOfArrays: number;
	installationTeam: string;
	installedSystemSize: number;
	photovoltaicCapacity: number;
	estimatedInstallationCost: number;
	estimatedSystemCost: number;
	estimatedMaintenanceCost: number;
	estimatedMaterialCost: number;
	estimatedInstallationDate: string;
	connectWithSolarPartner: string;
	fundsRequested: number;
	locationType: string;

	isNonProfit: boolean;
	estRevenue: number;
	estRoiPercentage: number;
	estLongTermRoiPercentage: number;

	estimatedSeedCost: number;
	estimatedLabourCost: number;
	estimatedPlantingDate: string;
	estimatedMaturityDate: string;
}
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "50vw",
	height: "70vh",
	bgcolor: "#0C2100",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
function AddProject() {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const supabase = supabaseClient;
	const [isNonProfit, setIsNonProfit] = useState(false);
	const [images, setImages] = useState<ImageUrls>([]);
	const [uploadedImgFiles, setUploadedImgFiles] = useState<File[]>([]);

	const handleIsNonProfitChange = (checked: boolean) => {
		setIsNonProfit(checked);
		setValue("isNonProfit", checked);
	};
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			title: "",
			image: null,
			coordinatorName: "",
			coordinatorPhone: "",
			description: "",
			numTrees: 0,
			pricePerTree: 0,
			projectType: "",
			agreements: false,
			imageFile: null,
			imageUrlInput: "",
			imageUrls: [],
			videoUrls: [],
			uploadMethod: true,
			treeType: "",
			treeProjectType: "",
			energyType: "",
			totalArea: 0,
			properties: [],
			projectAddressId: "",
			energyProductionTarget: 0,
			numOfArrays: 0,
			installationTeam: "",
			installedSystemSize: 0,
			photovoltaicCapacity: 0,
			estimatedInstallationCost: 0,
			estimatedSystemCost: 0,
			estimatedMaintenanceCost: 0,
			estimatedMaterialCost: 0,
			estimatedInstallationDate: "",
			connectWithSolarPartner: "",
			fundsRequested: 0,
			locationType: "",
			isNonProfit: false,
			estRevenue: 0,
			estRoiPercentage: 0,
			estimatedSeedCost: 0,
			estimatedLabourCost: 0,
			estimatedPlantingDate: "",
			estimatedMaturityDate: "",
			estLongTermRoiPercentage: 0,
		},
	});
	const formValues = getValues();
	const [loading, setLoading] = useState({ loading: false, message: "" });
	const projectType = watch("projectType");
	const locationType = watch("locationType");
	const imageUrls = watch("imageUrls");
	const videoUrls = watch("videoUrls");
	const uploadMethod = watch("uploadMethod");
	const energyType = watch("energyType");
	const installationTeam = watch("installationTeam");
	const properties = watch("properties");
	const treeProjectType = watch("treeProjectType");
	const treeType = watch("treeType");
	const estLongTermRoiPercentage = watch("estLongTermRoiPercentage");
	const estRoiPercentage = watch("estRoiPercentage");
	const fundsRequested = watch("fundsRequested");
	const connectWithSolarPartner = watch("connectWithSolarPartner");
	const estimatedPlantingDate = watch("estimatedPlantingDate");
	const estimatedMaturityDate = watch("estimatedMaturityDate");
	const [foundProperties, setFoundProperties] = useState<Property[]>([]);
	const [agreements, setAgreements] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const producer = useAppSelector((state) => state.producer);
	const userId = user.id;
	const addVideoUrl = () => {
		// Update form value to add a new video url
		setValue("videoUrls", [...videoUrls, ""]);
	};

	const removeVideoUrl = (index: number) => {
		// Update form value to remove the url at the specified index
		setValue(
			"videoUrls",
			[...videoUrls].filter((_, i) => i !== index)
		);
	};

	const removeImageUrl = (index: number) => {
		// Update form value to remove the url at the specified index
		setValue(
			"imageUrls",
			[...imageUrls].filter((_, i) => i !== index) as [
				{ url: string; isBanner: boolean }
			]
		);
	};
	// Here we retrieve the properties the user submitted that are verified so
	// we can list them as options for the user to select from when adding a project.
	const fetchProperties = async (producerId: string | null) => {
		if (!producerId) return;
		setLoading({ loading: true, message: "Fetching properties..." });
		axios
			.get(`/api/properties/verified/?producerId=${producerId}`)
			.then((res) => {
				console.log("Verified properties fetched: ", res.data.data);
				setFoundProperties(convertToCamelCase(res.data.data));
				setLoading({ loading: false, message: "" });
			})
			.catch((error) => {
				console.error("Error fetching properties:", error.message);
				setLoading({ loading: false, message: "" });
			});
	};

	useEffect(() => {
		if (foundProperties.length > 0) {
			setValue("properties", foundProperties);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [foundProperties]);

	useEffect(() => {
		// console.log(
		// 	"useEffect - producer.producerProperties >>>",
		// 	producer.producerProperties
		// );
		// setFoundProperties(producer.producerProperties);
		if (user) {
			console.log("user.producerId >>> ", user.producerId);
			fetchProperties(user.producerId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const [fileName, setFileName] = useState("");
	const uploadImage = async (file: File) => {
		const fileExt = file.name.split(".").pop();
		const fileUploadName = `${Math.random()}.${fileExt}`;
		setFileName(fileUploadName);
		const filePath = `projects/${user.id}/${fileUploadName}`;
		await axios
			.post("/api/upload_project_img", { filePath, file })
			.then((res) => {
				console.log("Image uploaded: ", res.data);
			})
			.catch((error) => {
				console.error("Error uploading image:", error.message);
			});
	};

	const producerId = user.producerId;
	const removeUploadedImagesOnExit = async (uploadedFilePaths: any) => {
		for (const uploadedFilePath of uploadedFilePaths) {
			const { error: deleteError } = await supabase.storage
				.from("projects")
				.remove([uploadedFilePath]);

			if (deleteError) {
				console.error("Error deleting the uploaded image:", deleteError);
			} else {
				console.log(`Image with at ${uploadedFilePath} deleted successfully`);
			}
		}
	};
	// Create a project uuid
	const projectId = uuid();

	const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
	useEffect(() => {
		if (uploadedImgFiles.length > 0) {
			for (const file of uploadedImgFiles) {
				const filePath = `projects/${user.id}/${projectId}/${file.name}`;
				setUploadedFilePaths([...uploadedFilePaths, filePath]);
			}
		}
	}, [uploadedImgFiles, projectId, user.id, uploadedFilePaths]);
	// Remove uploaded images from the server when the user exits the page before saving
	useEffect(() => {
		const handleBeforeUnload = (event: any) => {
			event.preventDefault(); // Prevent default confirmation dialog
			event.returnValue = ""; // Allow page to exit

			removeUploadedImagesOnExit(uploadedFilePaths)
				.then(() => {
					console.log("Uploaded images removed successfully");
				})
				.finally(() => {
					window.removeEventListener("beforeunload", handleBeforeUnload);
				});
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		// Cleanup function to remove the event listener
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [uploadedFilePaths]);
	const supabase_project_bucket_url = process.env.supabase_project_bucket_url;
	const onUpload = (files: File[]) => {
		console.log("Files were uploaded: ", files);
		if (files.length === 1) toast.success(`File uploaded successfully`);
		else toast.success(`Files uploaded successfully`);
		setUploadedImgFiles(files);
		files.map((file, index) => {
			const path = `/${user.id}/${projectId}/${file.name}`;
			const url = `${supabase_project_bucket_url}${path}`;
			console.log("length of images >>> ", images.length);
			console.log("index >>> ", index);
			console.log("url >>> ", url);
			if (images.length === 0) {
				if (index === 0) {
					setImages([...images, { url, isBanner: true }]);
				} else {
					setImages([...images, { url, isBanner: false }]);
				}
			} else {
				setImages([...images, { url, isBanner: false }]);
			}
		});
	};

	// Note - Might need to update everything to 'watch' for react-hook-form
	const createProject = async () => {
		const projectData = {
			title: formValues.title,
			projectCoordinatorContact: {
				name: formValues.coordinatorName,
				phone: formValues.coordinatorPhone,
			},
			imageUrls: images,
			videoUrls: videoUrls,
			description: formValues.description,
			producerId: producerId,
			status: "pending_verification",
			type: formValues.projectType,
			agreementAccepted: agreements,

			totalAreaSqkm: formValues.totalArea,
			propertyAddressId: formValues.projectAddressId,

			treeTarget: formValues.numTrees,
			treeProjectType: formValues.treeProjectType,
			treeType: formValues.treeType,
			estMaturityDate: estimatedMaturityDate,
			estPlantingDate: estimatedPlantingDate,
			totalFundsRequested: fundsRequested,

			targetKwhProductionPerYear: formValues.energyProductionTarget,
			targetArrays: formValues.numOfArrays,
			installationTeam: formValues.installationTeam,
			systemSizeInKw: formValues.installedSystemSize,
			systemCapacity: formValues.photovoltaicCapacity,
			estSeedCost: formValues.estimatedSeedCost,
			labourCost:
				formValues.projectType === "Tree"
					? formValues.estimatedLabourCost
					: formValues.estimatedInstallationCost,
			maintenanceCost: formValues.estimatedMaintenanceCost,
			energyProjectType: energyType,
			connectWithSolarPartner:
				connectWithSolarPartner === "Connect with partner" ? true : false,
			systemCost: formValues.estimatedSystemCost,
			locationType: locationType,

			createdAt: Date.now().toString(),
			updatedAt: Date.now().toString(),
			treeCount: 0,
			projectType: formValues.projectType,
			userId: user.id,
			fundsCollected: 0,
			producerProperties: {
				id: "",
				address: {
					addressLineOne: "",
					addressLineTwo: "",
					city: "",
					country: "",
					postalCode: "",
					stateProvince: "",
				},
				createdAt: "",
				producerId: "",
				updatedAt: "",
				isVerified: false,
			},
			treeProjects: [],
			energyProjects: [],
			solarProjects: [],

			isVerified: false,

			isNonProfit: isNonProfit,

			estRevenue: formValues.estRevenue,
			estRoiPercentage: estRoiPercentage,
			estLongTermRoiPercentage: estLongTermRoiPercentage,
		};

		if (projectData.totalAreaSqkm === 0)
			return toast.error("Please enter a valid project area size.");

		await axios
			.post("/api/projects", { projectData, producerId, projectId })
			.then((response: any) => {
				console.log("Project Created: ", response.data);
				toast.success("Project created successfully!");
				setLoading({ loading: false, message: "" });
				router.push("/p/projects");
			})
			.catch((error: any) => {
				console.log("Error creating project:", error);
				toast.error(`Error creating project. ${error}`);
				setLoading({ loading: false, message: "" });
			});
	};

	const onSubmit = async () => {
		setLoading({ loading: true, message: "Uploading project..." });
		const formValues = getValues();

		if (!agreements) {
			toast.warning("Please accept the agreements before submitting.");
			setLoading({ loading: false, message: "" });
			return;
		}
		try {
			await createProject();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(`Error adding project: ${error.message}`);
				console.error("Error adding project:", error);
			} else {
				toast.error("An unexpected error occurred during project update.");
				console.error("Error adding project:", error);
			}
		}
	};
	const toggleUploadMethod = () => {
		setValue("uploadMethod", !getValues("uploadMethod"));
	};

	const handleAgreementButtonClick = () => {
		handleClose();
		setAgreements(true);
	};

	const fetchProducerData = async () => {
		const res = await axios.get(`/api/producer?user_id=${userId}`);
		const data = await res.data;
		const producerData = convertToCamelCase(data.producerData[0]);
		dispatch(
			setProducer({
				...data,
				id: producerData.id,
				producerProperties: producerData.producerProperties,
			})
		);
	};

	useEffect(
		() => {
			if (user && userId) {
				fetchProducerData();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user, userId]
	);
	const [urgentNotification, setUrgentNotification] = useState<{
		message: string;
		actionUrl: string;
		actionType: string;
		dismiss?: boolean;
	}>({ message: "", actionUrl: "", actionType: "" });
	const [allPropertiesUnverified, setAllPropertiesUnverified] = useState(false);

	// If the user has no verified properties, we show a notification to prompt them to submit an address
	useEffect(() => {
		if (!foundProperties) return;
		if (foundProperties.length === 0) {
			setAllPropertiesUnverified(true);
			setUrgentNotification({
				message: "You need to submit an address to create new projects.",
				actionUrl: "/settings?tab=properties",
				actionType: "Resolve",
				dismiss: false,
			});
		}
		if (foundProperties.length > 0) {
			setAllPropertiesUnverified(false);
			setUrgentNotification({
				message: "",
				actionUrl: "",
				actionType: "",
				dismiss: false,
			});
		}
	}, [foundProperties, producer]);

	if (loading.loading)
		return (
			<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
				<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
				<Loading message={loading.message} />
			</div>
		);
	if (allPropertiesUnverified || foundProperties.length === 0)
		return (
			<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
				<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
				<div>
					{urgentNotification.message !== "" && (
						<>
							<UrgentNotification urgentNotification={urgentNotification} />
						</>
					)}
				</div>
			</div>
		);
	return (
		<div className='container mx-auto py-6 px-4 min-h-[100vh] '>
			<div className='md:w-[71%] mx-auto'>
				{urgentNotification.message !== "" && (
					<UrgentNotification urgentNotification={urgentNotification} />
				)}
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col md:w-[800px] mx-auto'
			>
				<h1 className='text-3xl font-semibold mb-6 flex justify-start text-left'>
					Add Project
				</h1>
				<label className='flex flex-col md:w-[800px]'>
					<span className='mb-[4px] mt-2'>Project Title:</span>
					<input
						type='text'
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 w-full'
						{...register("title", { required: true })}
					/>
				</label>
				<label className='flex flex-col md:w-[800px] mt-4'>
					{properties.length > 0 && (
						<>
							<span className='mb-[4px]'>Project Location:</span>
							<select
								{...register("projectAddressId", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>
									Select the address your project will be operated from
								</option>
								{properties.map(
									(property: {
										id: React.Key | null | undefined;
										address: {
											addressLineOne:
												| string
												| number
												| boolean
												| React.ReactElement<
														any,
														string | React.JSXElementConstructor<any>
												  >
												| React.ReactFragment
												| React.ReactPortal
												| React.PromiseLikeOfReactNode
												| null
												| undefined;
											addressLineTwo: any;
											city:
												| string
												| number
												| boolean
												| React.ReactElement<
														any,
														string | React.JSXElementConstructor<any>
												  >
												| React.ReactFragment
												| React.ReactPortal
												| React.PromiseLikeOfReactNode
												| null
												| undefined;
											stateProvince:
												| string
												| number
												| boolean
												| React.ReactElement<
														any,
														string | React.JSXElementConstructor<any>
												  >
												| React.ReactFragment
												| React.ReactPortal
												| React.PromiseLikeOfReactNode
												| null
												| undefined;
											country:
												| string
												| number
												| boolean
												| React.ReactElement<
														any,
														string | React.JSXElementConstructor<any>
												  >
												| React.ReactFragment
												| React.ReactPortal
												| React.PromiseLikeOfReactNode
												| null
												| undefined;
										};
									}) => (
										<option
											key={property.id}
											value={property.id ? property.id.toString() : undefined}
										>
											{property.address.addressLineOne},{" "}
											{property.address.addressLineTwo &&
												`${property.address.addressLineTwo}, `}{" "}
											{property.address.city}, {property.address.stateProvince},{" "}
											{property.address.country}
										</option>
									)
								)}
							</select>
						</>
					)}
				</label>

				<label className='flex flex-col md:w-[800px] mt-4'>
					<span className='mb-[4px] '>Project Type:</span>
					<select
						{...register("projectType", { required: true })}
						className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
					>
						<option value=''>Select a project type</option>
						<option value='Tree'>Tree</option>
						<option value='Energy'>Renewable Energy</option>
					</select>
				</label>
				<label className='flex flex-col mt-[8px] md:w-[800px]'>
					<span className='mb-[4px] mt-2'>
						Is this a non-profit initiative?
					</span>
					<div className='flex items-center'>
						<Switch
							onChange={handleIsNonProfitChange}
							checked={isNonProfit}
							className='react-switch mr-2'
							id='isNonProfit'
							offColor='#808080'
							onColor='#40821A'
							height={20}
							width={48}
							uncheckedIcon={false}
							checkedIcon={false}
						/>
						{isNonProfit ? "Yes" : "No"}
					</div>
				</label>
				<label className='flex flex-col md:w-[800px]'>
					<span className='mb-[4px] mt-2'>Total Project Area (km²)</span>
					<input
						type='number'
						{...register("totalArea", { required: true })}
						className='border-2 border-gray-300 rounded-md p-2 w-full'
					/>
				</label>
				<br />

				{projectType === "Tree" && (
					<>
						<label className='flex flex-col mt-[8px] md:w-[800px]'>
							<span className='mb-[4px] mt-2'>Tree Project Type:</span>
							<select
								{...register("treeProjectType", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>Select a tree project type</option>
								{isNonProfit && (
									<option value='Restoration'>Restoration</option>
								)}
								<option value='Timber / Lumber'>Timber / Lumber</option>
								<option value='Fruit'>Fruits</option>
								<option value='Nut'>Nuts</option>
								<option value='Bio Fuel'>Bio Fuel</option>
								<option value='Pulp'>Pulp</option>
								<option value='Syrup'>Syrup</option>
								<option value='Oil / Chemical'>Oils / Chemicals</option>
							</select>
						</label>
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>
								How many trees are you aiming to plant for this project?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								🌳{" "}
								<input
									type='number'
									{...register("numTrees", { required: true })}
									className='w-[90%] md:w-[96%] outline-none'
								/>
							</div>
						</label>
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>
								What kind of trees are you going to plant?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								🌳{" "}
								<input
									type='text'
									{...register("treeType", { required: true })}
									className='w-[90%] md:w-[96%] outline-none'
								/>
							</div>
						</label>
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>
								How much do you want to raise for seeds/saplings?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedSeedCost", { required: true })}
									className='w-[90%] md:w-[97%] outline-none'
								/>
							</div>
							<span className='mb-[4px] mt-2'>
								How much will the planting & labour cost be?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedLabourCost", { required: true })}
									className='w-[90%] md:w-[97%] outline-none'
								/>
							</div>
							<span className='mb-[4px] mt-2'>
								How much will the yearly maintenance cost be?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedMaintenanceCost", { required: true })}
									className='w-[90%] md:w-[97%] outline-none'
								/>
							</div>
							<div className='flex mt-12'>
								<div>
									<span className='mb-[4px] mt-2 mr-2'>
										When is the estimated planting date?
									</span>
									<input
										type='date'
										{...register("estimatedPlantingDate", { required: true })}
										className='bg-white border-2 border-gray-300 rounded-md mt-2 p-2 text-gray-400 w-max'
									/>
								</div>
								{treeProjectType !== "Restoration" && (
									<div>
										<span className='mb-[4px] mt-2'>
											When is the estimated harvest date?
										</span>
										<input
											type='date'
											{...register("estimatedMaturityDate", { required: true })}
											className='bg-white border-2 border-gray-300 rounded-md mt-2 p-2 text-gray-400 w-max'
										/>
									</div>
								)}
							</div>
						</label>
					</>
				)}
				{projectType === "Energy" && (
					<>
						<label className='flex flex-col mt-[8px] md:w-[800px]'>
							<span className='mb-[4px] mt-2'>
								Renewable Energy Project Type:
							</span>
							<select
								{...register("energyType", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>Select a renewable energy project type</option>
								<option value='Solar'>Solar</option>
							</select>
						</label>
						{energyType === "Solar" && (
							<>
								{isNonProfit ? (
									<label className='flex flex-col mt-[8px] md:w-[800px]'>
										<span className='mb-[4px] mt-2'>
											Is this an urban, or rural project?
										</span>
										<select
											{...register("locationType", { required: true })}
											className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
										>
											<option value=''>Select the project location type</option>
											<option value='Urban'>Urban</option>

											<option value='Rural'>Rural</option>
										</select>
									</label>
								) : (
									<label className='flex flex-col mt-[8px] md:w-[800px]'>
										<span className='mb-[4px] mt-2'>
											Is this a residential, commercial, or rural project?
										</span>
										<select
											{...register("locationType", { required: true })}
											className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
										>
											<option value=''>Select the project location type</option>
											<option value='Residential'>Residential</option>
											<option value='Commercial'>Commercial</option>
											<option value='Rural'>Rural</option>
										</select>
									</label>
								)}
								{locationType === "Residential" && (
									<div className='mt-4'>
										We encourage you to connect with a solar partner to help you
										with installing a residential solar system.
										<p>
											<a
												className='text-[var(--cta-one)] hover:text-[var(--cta-one-hover)] transition-colors'
												href='https://forms.gle/Q5bXYmVca6qQLXuY9'
												target='_blank'
											>
												Fill out this form
											</a>{" "}
											if you want us to refer you to a solar partner vetted by
											our team.
										</p>
									</div>
								)}
								{locationType !== "Residential" && (
									<>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the target yearly energy production of this
												project (kWh)?
											</span>
											<input
												{...register("energyProductionTarget", {
													required: true,
												})}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												How many arrays will be setup?
											</span>
											<input
												{...register("numOfArrays", { required: true })}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='text'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												Are you contracting a company to install the system,
												doing this with your own team of installers, or are you
												still looking for an installation team?
											</span>
											<select
												{...register("installationTeam", { required: true })}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
											>
												<option value=''>Select one</option>
												<option value='Has company'>
													I&apos;ve hired a company.
												</option>
												<option value='Has team'>I have a team.</option>
												<option value='Needs team'>
													I&apos;m looking for a professional team to install
													the system.
												</option>
											</select>
										</label>
									</>
								)}
								{installationTeam === "Has company" ||
								installationTeam === "Has team" ? (
									<>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What will the size of the installed system be? (in kW)
											</span>
											<input
												{...register("installedSystemSize")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										{/* <label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-4px] mt-2'>
												If known, what is the photovoltaic capacity of the
												system?
											</span>
											<input
												{...register("photovoltaicCapacity")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the estimated cost of the system installation?
											</span>
											$
											<input
												{...register("estimatedInstallationCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the total cost of the system (do not include
												labour charges)?
											</span>
											<input
												{...register("estimatedSystemCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												If discussed, what are the estimated maintenance costs
												for the system?
											</span>
											<input
												{...register("estimatedMaintenanceCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>

										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												If discussed, what&apos;s the estimated material cost?
												(any materials beyond the arrays, inverters, and
												racking)
											</span>
											<input
												{...register("estimatedMaterialCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												When is the estimated installation date?
											</span>
											<input
												{...register("estimatedInstallationDate")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label> */}
									</>
								) : installationTeam === "Needs team" ? (
									<>
										<label className='flex flex-col mt-[8px] md:w-[800px]'>
											<span className='mb-[4px] mt-2'>
												Do you want us to connect you with a trusted solar
												installation partner in your area to handle the
												installation for this project?
											</span>
											<select
												{...register("connectWithSolarPartner")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
											>
												<option value=''>Select one</option>
												<option value='Connect with partner'>
													Yes, connect me with a trusted Solar Installation
													Partner.
												</option>
												<option value='Do not connect with partner'>
													No, I will look for a team on my own.
												</option>
											</select>
										</label>
									</>
								) : null}

								{locationType !== "Residential" && (
									<label className='flex flex-col mt-[8px] md:w-[800px]'>
										<span className='mb-[4px] mt-2'>
											How much do you want to raise for this project?
										</span>
										<input
											{...register("fundsRequested")}
											value={fundsRequested.toLocaleString()}
											className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
											type='number'
										/>
									</label>
								)}
							</>
						)}
					</>
				)}
				<br />
				{locationType !== "Residential" && (
					<>
						<label>
							<span className='my-4'>Project Videos:</span>
							<p className='text-sm'>
								Add urls for videos you want to share with your project from
								YouTube, Vimeo, Wistia, or Twitch!
							</p>

							<>
								{videoUrls?.length > 0 ? (
									videoUrls?.map((url, index) => (
										<VideoUploadInput
											key={index}
											index={index}
											removeVideoUrl={removeVideoUrl}
											register={register}
										/>
									))
								) : (
									<VideoUploadInput
										key={0}
										index={0}
										removeVideoUrl={removeVideoUrl}
										register={register}
									/>
								)}
								{videoUrls.length < 9 && (
									<button
										type='button'
										onClick={addVideoUrl}
										className='mb-4 mt-2 text-left w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] 
									text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
									>
										Add another URL
									</button>
								)}
							</>
						</label>
						<label className='my-4 md:w-[800px]'>
							<span className=''>Project Images:</span>
							{user.id !== "" && (
								<ImageUpload
									onUpload={onUpload}
									removeImageUrl={removeImageUrl}
									register={register}
									images={images}
									setImages={setImages}
									userId={user?.id!}
									projectId={projectId}
								/>
							)}
						</label>
						<br />
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Coordinator Name:</span>
							<input
								{...register("coordinatorName", { required: true })}
								type='text'
								className='border-2 border-gray-300 rounded-md p-2 w-full'
							/>
						</label>
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Coordinator Phone:</span>
							<input
								{...register("coordinatorPhone", { required: true })}
								type='tel'
								className='border-2 border-gray-300 rounded-md p-2 w-full'
							/>
						</label>
						<br />
						<label className='flex flex-col md:w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Description:</span>
							<textarea
								{...register("description", { required: true })}
								className='text-gray-700 border-2 border-gray-300 rounded-md p-2 h-[150px] w-full'
							/>
						</label>
					</>
				)}
				<br />
				{!isNonProfit && locationType !== "Residential" && (
					<>
						<label className='flex flex-col md:w-[800px]'>
							{projectType === "Tree" ? (
								<span className='mb-[4px] mt-2'>
									What do you estimate the revenue{" "}
									{treeProjectType === "Timber / Lumber" ? "" : "per year"} will
									be?
								</span>
							) : (
								<span className='mb-[4px] mt-2'>
									What do you estimate the revenue per year will be?
								</span>
							)}
							<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
								${" "}
								<input
									{...register("estRevenue", { required: true })}
									type='number'
									className='w-[98%] outline-none'
								/>
							</div>
						</label>
						<br />
						{treeProjectType === "Timber / Lumber" ? (
							<>
								<label className='flex flex-col md:w-[800px]'>
									<span className='mb-[4px] mt-2'>
										What percentage of the profits will you offer investors when
										the trees are ready to harvest?
									</span>
									<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
										%{" "}
										<input
											{...register("estRoiPercentage", { required: true })}
											type='number'
											className='w-[90%] md:w-[97%] outline-none'
											min={0}
											max={100}
										/>
									</div>
								</label>
							</>
						) : (
							<>
								<label className='flex flex-col md:w-[800px]'>
									<span className='mb-[4px] mt-2'>
										What percentage of the profits will you offer investors
										until the investment is repaid?
									</span>
									<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
										%{" "}
										<input
											{...register("estRoiPercentage", { required: true })}
											type='number'
											className='w-[90%] md:w-[97%] outline-none'
											min={0}
											max={100}
										/>
									</div>
								</label>
								<br />
								<label className='flex flex-col md:w-[800px]'>
									<span className='mb-[4px] mt-2'>
										What percentage of the profits will you offer investors
										after the investment is repaid?
									</span>
									<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
										%{" "}
										<input
											{...register("estLongTermRoiPercentage", {
												required: true,
											})}
											type='number'
											className='w-[90%] md:w-[97%] outline-none'
											min={0}
											max={100}
										/>
									</div>
								</label>
							</>
						)}
						<br />
					</>
				)}
				{locationType !== "Residential" && (
					<div className='flex justify-between '>
						{!agreements ? (
							<div>
								<h3>Agreement:</h3>{" "}
								<p className='text-gray-400'>
									You must agree to the following agreement before you can
									create this project.
								</p>
								<button
									type='button'
									onClick={() => handleOpen()}
									className='my-2 text-left w-[300px] bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
								>
									View agreement
								</button>
								<Modal
									open={open}
									onClose={handleClose}
									aria-labelledby='modal-modal-title'
									aria-describedby='modal-modal-description'
								>
									<Box sx={style}>
										<Agreement
											handleAgreementButtonClick={handleAgreementButtonClick}
											isNonProfit={isNonProfit}
										/>
									</Box>
								</Modal>
							</div>
						) : (
							<>
								<h3 className='flex items-center text-gray-400'>
									<IoIosCheckmarkCircle className='!text-[var(--cta-one)] text-2xl mr-2 mt-[2px]' />{" "}
									Agreements
								</h3>
							</>
						)}
					</div>
				)}
				<br />
				<div className='flex justify-end'>
					<button
						type='submit'
						className={
							locationType !== "Residential" && agreements
								? "mt-[16px] bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer w-full"
								: "bg-gray-500 text-white font-bold py-2 px-4 rounded w-full cursor-default"
						}
						disabled={
							locationType !== "Residential" && agreements ? false : true
						}
					>
						Submit Project
					</button>
				</div>
			</form>
		</div>
	);
}

export default withAuth(AddProject);
