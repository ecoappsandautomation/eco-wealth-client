"use client";
import React, { ReactHTMLElement, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import { useForm, useFieldArray, Control, useWatch } from "react-hook-form";
import Image from "next/image";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import Loading from "@/components/Loading";
import moment from "moment";
import ImageUpload from "@/components/ImageUpload";
import VideoUploadInput from "@/components/producer/projects/VideoUpload";
import { convertSnakeCaseToUpper } from "@/utils/convertCase";
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
	imageUrls: ImageUrls;
	videoUrls: string[];
	imageUrlInput: string;
	uploadMethod: boolean;
	treeProjectType: string;
	treeType: string;
	energyType: string;
	totalArea: number;
	properties: Property[];
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

	estSeedCost: number;
	estLabourCost: number;
	estMaintenanceCost: number;
	estPlantingDate: string | EpochTimeStamp;
	estMaturityDate: string | EpochTimeStamp;
}

function Edit() {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user);
	const [project, setProject] = useState<Project | null>(null);
	const [uploadedImgFiles, setUploadedImgFiles] = useState<File[]>([]);
	const path = useParams();
	const id = path?.id;
	const [images, setImages] = useState<ImageUrls>([]);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
		control,
	} = useForm<FormValues>({
		defaultValues: {
			title: "",
			image: null,
			imageUrls: [],
			videoUrls: [],
			coordinatorName: "",
			coordinatorPhone: "",
			description: "",
			numTrees: 0,
			pricePerTree: 0,
			projectType: "",
			agreements: false,
			imageFile: null,
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
			estSeedCost: 0,
			estLabourCost: 0,
			estMaintenanceCost: 0,
			estPlantingDate: "",
			estMaturityDate: "",
			estLongTermRoiPercentage: 0,
		},
	});

	const fetchProject = async () => {
		setLoading({ loading: true, message: "Loading project..." });
		await axios
			.post("/api/project", {
				projectId: id,
				options: {
					query: `*, tree_projects(*), energy_projects(*), solar_projects(*), producer_properties(*), project_milestones(*), project_financials(*)`,
				},
			})
			.then((res) => {
				console.log("Project data:", res.data.data);
				setLoading({ loading: false, message: "" });

				setProject(convertToCamelCase(res.data.data));
			})
			.catch((error) => {
				console.error("Error fetching project:", error.message);
				setLoading({ loading: false, message: "" });
				toast.error(error.message);
			});
	};
	useEffect(() => {
		fetchProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (project) {
			setValue("title", project.title);
			setValue("description", project.description);
			setValue("numTrees", project.treeProjects.treeTarget);
			setImages(project.imageUrls);
			setValue("imageUrls", project.imageUrls);
			setValue("pricePerTree", project.treeProjects?.fundsRequestedPerTree);
			setValue("projectType", project.type);
			setValue("videoUrls", project.videoUrls);
			setValue("energyType", project.energyProjectType);
			setValue("coordinatorName", project.projectCoordinatorContact.name);
			setValue("coordinatorPhone", project.projectCoordinatorContact.phone);
			setValue("projectAddressId", project.propertyAddressId);
			setValue("properties", [project.producerProperties]);
			setValue("totalArea", project.totalAreaSqkm);
			setValue("estRevenue", project.projectFinancials?.estRevenue);
			setValue("estRoiPercentage", project.projectFinancials?.estRoiPercentage);
			setValue(
				"estLongTermRoiPercentage",
				project.projectFinancials?.estLongTermRoiPercentage
			);
			setValue("isNonProfit", project.isNonProfit);
			setValue("projectAddressId", project.propertyAddressId);
			if (project.energyProjects) {
				setValue(
					"energyProductionTarget",
					project.energyProjects.targetKwhProductionPerYear
				);
				setValue(
					"locationType",
					project.energyProjects?.solarProjects[0]?.locationType
				);
				setValue("numOfArrays", project.energyProjects?.targetArrays);
				setValue("installationTeam", project.energyProjects?.installationTeam);
				setValue(
					"installedSystemSize",
					project.solarProjects?.[0].systemSizeInKw
				);
				setValue(
					"photovoltaicCapacity",
					project.solarProjects?.[0].systemCapacity
				);
				setValue(
					"estimatedInstallationCost",
					project.solarProjects?.[0].labourCost
				);
				setValue("estimatedSystemCost", project.solarProjects?.[0].systemCost);
				setValue(
					"estimatedMaintenanceCost",
					project.solarProjects?.[0].maintenanceCost
				);
				setValue(
					"connectWithSolarPartner",
					project.solarProjects?.[0].connectWithSolarPartner
				);
				setValue("fundsRequested", project.energyProjects.totalFundsRequested);
			}
			if (project.treeProjects) {
				setValue("numTrees", project.treeProjects.treeTarget);
				setValue("pricePerTree", project.treeProjects.fundsRequestedPerTree);
				setValue("treeProjectType", project.treeProjects.projectType);
				setValue("treeType", project.treeProjects.treeType);
				setValue("estSeedCost", project.treeProjects.estSeedCost);
				setValue("estLabourCost", project.treeProjects.estLabourCost);
				setValue(
					"estMaintenanceCost",
					project.treeProjects.estMaintenanceCostPerYear
				);
				setValue("estPlantingDate", project.treeProjects.estPlantingDate);
				setValue("estMaturityDate", project.treeProjects.estMaturityDate);
			}
		}
	}, [project, setValue]);

	const formValues = getValues();
	const [loading, setLoading] = useState({ loading: false, message: "" });
	const projectType = watch("projectType");
	const uploadMethod = watch("uploadMethod");
	const imageUrls = watch("imageUrls");
	const videoUrls = watch("videoUrls");
	const energyType = watch("energyType");
	const properties = watch("properties");
	const title = watch("title");
	const coordinatorName = watch("coordinatorName");
	const coordinatorPhone = watch("coordinatorPhone");
	const description = watch("description");
	const totalArea = watch("totalArea");
	const projectAddressId = watch("projectAddressId");
	const treeTarget = watch("numTrees");
	const fundsRequestedPerTree = watch("pricePerTree");
	const treeType = watch("treeType");
	const fundsRequested = watch("fundsRequested");
	const energyProductionTarget = watch("energyProductionTarget");
	const numOfArrays = watch("numOfArrays");
	const installedSystemSize = watch("installedSystemSize");
	const photovoltaicCapacity = watch("photovoltaicCapacity");
	const estimatedInstallationCost = watch("estimatedInstallationCost");
	const estimatedSystemCost = watch("estimatedSystemCost");
	const estimatedMaintenanceCost = watch("estimatedMaintenanceCost");
	const installationTeam = watch("installationTeam");
	const connectWithSolarPartner = watch("connectWithSolarPartner");
	const estRoiPercentage = watch("estRoiPercentage");
	const estLongTermRoiPercentage = watch("estLongTermRoiPercentage");
	const estRevenue = watch("estRevenue");
	const isNonProfit = watch("isNonProfit");
	const locationType = watch("locationType");
	const treeProjectType = watch("treeProjectType");
	const estSeedCost = watch("estSeedCost");
	const estLabourCost = watch("estLabourCost");
	const estPlantingDate = watch("estPlantingDate");
	const estMaturityDate = watch("estMaturityDate");
	const estMaintenanceCost = watch("estMaintenanceCost");
	const [editPlantingDate, setEditPlantingDate] = useState(false);
	const [editAddress, setEditAddress] = useState(false);

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
	// Here we retrieve the properties the producer submitted that are verified so
	// we can list them as options for the producer to select from when adding a project.
	const fetchProperties = async (producerId: string) => {
		setLoading({ loading: true, message: "Fetching properties..." });
		axios
			.get(`/api/properties/verified?producerId=${producerId}`)
			.then((res) => {
				setValue("properties", res.data.data);

				setLoading({ loading: false, message: "" });
			})
			.catch((error) => {
				console.error("Error fetching properties:", error);
				toast.error(error.message);
				setLoading({ loading: false, message: "" });
			});
	};
	useEffect(() => {
		if (user) {
			fetchProperties(user.producerId || "");
		} else setLoading({ loading: false, message: "" });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Upload all images to the server
	const uploadImages = async (files: File[], projectId: string) => {
		try {
			await axios.post(`/api/upload_project_img`, { files, projectId });
			toast.success("Images uploaded successfully!");
		} catch (error: any) {
			console.error("Error uploading images:", error);
			toast.error(error.message);
			throw error; // Propagate the error to the caller
		}
	};
	const producerId = user.producerId;

	const updateProject = async () => {
		const status = "pending_update_review";
		console.log("updating producerId >>> ", producerId);
		console.log("updating addressId >>> ", projectAddressId);
		await axios
			.post(`/api/projects/update`, {
				title: title,
				imageUrls: images,
				videoUrls: videoUrls,
				coordinatorName: coordinatorName,
				coordinatorPhone: coordinatorPhone,
				description: description,
				currentStatus: project?.status,
				newStatus: status,
				type: projectType,
				totalArea: totalArea,
				projectAddressId: projectAddressId,
				treeTarget: treeTarget,
				fundsRequestedPerTree: fundsRequestedPerTree,
				treeType: treeType,
				fundsRequested: fundsRequested,
				energyProductionTarget: energyProductionTarget,
				numOfArrays: numOfArrays,
				installedSystemSize: installedSystemSize,
				photovoltaicCapacity: photovoltaicCapacity,
				estimatedInstallationCost: estimatedInstallationCost,
				estimatedSystemCost: estimatedSystemCost,
				estimatedMaintenanceCost: estimatedMaintenanceCost,
				energyType: energyType,
				installationTeam: installationTeam,
				connectWithSolarPartner: connectWithSolarPartner,
				producerId,
				projectId: id,
			})
			.then((res) => {
				console.log("Project updated:", res.data);
				toast.success("Project updated!");
				setLoading({ loading: false, message: "" });
			})
			.catch((err) => {
				console.log("Error updating project: ", err);
				toast.error("Could not update project", err.message);
				setLoading({ loading: false, message: "" });
			});
	};

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
	const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
	useEffect(() => {
		if (uploadedImgFiles.length > 0) {
			for (const file of uploadedImgFiles) {
				const filePath = `projects/${user.id}/${id}/${file.name}`;
				setUploadedFilePaths([...uploadedFilePaths, filePath]);
			}
		}
	}, [uploadedImgFiles, id, user.id, uploadedFilePaths]);
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

	const onSubmit = async () => {
		setLoading({ loading: true, message: "Updating project..." });

		let uploadedFilePaths: string[] = [];
		try {
			// Update the project with the array of public image URLs
			await updateProject();
		} catch (error) {
			if (error instanceof Error) {
				toast.error(`Error updating project: ${error.message}`);
				console.error("Error updating project:", error);
			} else {
				toast.error("An unexpected error occurred during project update.");
				console.error("Error updating project:", error);
			}
		}
	};

	const handleGoBack = () => {
		router.back();
	};
	const supabase_project_bucket_url = process.env.supabase_project_bucket_url;

	const onUpload = (files: File[]) => {
		console.log("Files were uploaded: ", files);
		if (files.length === 1) toast.success(`File uploaded successfully`);
		else toast.success(`Files uploaded successfully`);
		setUploadedImgFiles(files);
		files.map((file, index) => {
			const path = `/${user.id}/${id}/${file.name}`;
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
		// file.map(({ name }) => {
		// 	const path = `/projects/${id}/${name}`;
		// 	setFilePaths([...filePaths, path]);
		// });
	};

	function findAddressById(addresses: any, searchId: string): any | null {
		const foundAddress = addresses?.find(
			(address: any) => address?.id === searchId
		);
		return foundAddress || null;
	}
	const selectedAddress = findAddressById(properties, projectAddressId);

	const [showEditProjectDetails, setShowEditProjectDetails] = useState(false);
	const handleEditProjectDetails = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowEditProjectDetails(!showEditProjectDetails);
	};
	if (loading.loading)
		return (
			<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
				<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
				<Loading message={loading.message} />
			</div>
		);
	return (
		<div className='container mx-auto py-6 px-4 min-h-[100vh] lg:w-1/2'>
			<p
				onClick={handleGoBack}
				className='cursor-pointer '
			>
				← Back to project page
			</p>
			<div className='mb-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-2xl font-semibold '>Update Project</h1>
					{project && (
						<p className='text-gray-400 text-sm'>
							<b>Status:</b> {convertSnakeCaseToUpper(project.status)}
						</p>
					)}
				</div>
				{project &&
				project?.status !== "pending_verification" &&
				project?.status !== "pending_reverification" ? (
					<h4 className='text-gray-400 text-sm mt-2'>
						<b>Note:</b> Updating the project will trigger another review
						process
					</h4>
				) : null}
			</div>
			{projectType === "Tree" ? (
				<div className='text-2xl mb-4'>🌳 Tree Project</div>
			) : "Energy" ? (
				<div className='text-2xl mb-4'>⚡Energy Project</div>
			) : null}
			<form onSubmit={handleSubmit(onSubmit)}>
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Title:</span>
					<input
						type='text'
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 w-full'
						{...register("title", { required: true })}
					/>
				</label>

				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Location:</span>
					{projectAddressId && (
						<div className='flex items-center w-[max-content]'>
							<p className=''>
								{selectedAddress?.address.addressLineOne},{" "}
								{selectedAddress?.address.addressLineTwo &&
									`${selectedAddress?.address.addressLineTwo},`}
								{selectedAddress?.address.city},{" "}
								{selectedAddress?.address.country}
							</p>
							<button
								className='mb-4 mt-2 text-left ml-2 w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									if (!editAddress) setEditAddress(true);
									else setEditAddress(false);
								}}
							>
								{editAddress ? "Cancel" : "Edit"}
							</button>
						</div>
					)}

					{editAddress && (
						<select
							{...register("projectAddressId", { required: true })}
							className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
						>
							<option value=''>
								Select the address your project will be operated from
							</option>
							{properties &&
								properties.map(
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
											key={property?.id}
											value={property?.id ? property.id.toString() : undefined}
										>
											{property?.address.addressLineOne},{" "}
											{property?.address.addressLineTwo &&
												`${property?.address.addressLineTwo}, `}{" "}
											{property?.address.city},{" "}
											{property?.address.stateProvince},{" "}
											{property?.address.country}
										</option>
									)
								)}
						</select>
					)}
				</label>
				<br />

				{showEditProjectDetails ? (
					<>
						<label className='flex flex-col'>
							<span className='mb-[4px] mt-2'>Total Project Area (km²)</span>
							<input
								type='number'
								{...register("totalArea", { required: true })}
								className='border-2 border-gray-300 rounded-md p-2 w-full'
							/>
						</label>
						{projectType === "Tree" && (
							<>
								<label className='flex flex-col mt-[8px] md:w-full'>
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
								<label className='flex flex-col md:w-full'>
									<span className='mb-[4px] mt-2'>
										How many trees are you aiming to plant for this project?
									</span>
									<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400 '>
										🌳{" "}
										<input
											type='number'
											{...register("numTrees", { required: true })}
											className='w-[90%] md:w-[90%] outline-none'
										/>
									</div>
								</label>
								<label className='flex flex-col md:w-full'>
									<span className='mb-[4px] mt-2'>
										What kind of trees are you going to plant?
									</span>
									<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
										🌳{" "}
										<input
											type='text'
											{...register("treeType", { required: true })}
											className='w-[90%] md:w-[90%] outline-none'
										/>
									</div>
								</label>
								<label className='flex flex-col md:w-full'>
									<span className='mb-[4px] mt-2'>
										How much do you want to raise for seeds/saplings?
									</span>
									<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
										${" "}
										<input
											type='number'
											step='1'
											{...register("estSeedCost", { required: true })}
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
											{...register("estLabourCost", { required: true })}
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
											{...register("estMaintenanceCost", { required: true })}
											className='w-[90%] md:w-[97%] outline-none'
										/>
									</div>
									<div className='flex mt-12'>
										{!editPlantingDate ? (
											<div>
												<span className='mb-[4px] mt-2 mr-2'>
													Estimate planting date:
												</span>
												{moment(estPlantingDate).format("MMMM DD, YYYY")}
												<button
													className='mb-4 mt-2 text-left ml-2 w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
													onClick={(e) => {
														e.preventDefault();
														setEditPlantingDate(true);
													}}
												>
													Edit
												</button>
											</div>
										) : (
											<div>
												<span className='mb-[4px] mt-2 mr-2'>
													Select new planting date:
												</span>

												<input
													type='date'
													{...register("estPlantingDate", { required: true })}
													className='bg-white border-2 border-gray-300 rounded-md mt-2 p-2 text-gray-400 w-max'
												/>
												<button
													className='mb-4 mt-2 text-left ml-2 w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
													onClick={(e) => {
														e.preventDefault();
														setEditPlantingDate(false);
													}}
												>
													Cancel
												</button>
											</div>
										)}
										{treeProjectType !== "Restoration" && (
											<div>
												<span className='mb-[4px] mt-2'>
													When is the estimated harvest date?
												</span>
												<input
													type='date'
													{...register("estMaturityDate", { required: true })}
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
								<label className='flex flex-col mt-[8px]'>
									<span className='mb-[4px] mt-2'>
										Renewable Energy Project Type:
									</span>
									<select
										{...register("energyType", { required: true })}
										className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
									>
										<option value=''>
											Select a renewable energy project type
										</option>
										<option value='Solar'>Solar</option>
									</select>
								</label>
								{energyType === "Solar" && (
									<>
										<label className='flex flex-col mt-[8px]'>
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
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												How many arrays will be setup?
											</span>
											<input
												{...register("numOfArrays", { required: true })}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='text'
											/>
										</label>
										<label className='flex flex-col mt-[8px]'>
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
										{installationTeam === ("Has company" || "Has team") ? (
											<>
												<label className='flex flex-col mt-[8px]'>
													<span className='mb-[4px] mt-2'>
														What will the size of the installed system be? (in
														kW)
													</span>
													<input
														{...register("installedSystemSize")}
														className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
														type='number'
													/>
												</label>
												<label className='flex flex-col mt-[8px]'>
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
												<label className='flex flex-col mt-[8px]'>
													<span className='mb-[4px] mt-2'>
														What is the estimated cost of the system
														installation?
													</span>
													$
													<input
														{...register("estimatedInstallationCost")}
														className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
														type='number'
													/>
												</label>
												<label className='flex flex-col mt-[8px]'>
													<span className='mb-[4px] mt-2'>
														What is the total cost of the system minus the
														labour?
													</span>
													<input
														{...register("estimatedSystemCost")}
														className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
														type='number'
													/>
												</label>
												<label className='flex flex-col mt-[8px]'>
													<span className='mb-[4px] mt-2'>
														If discussed, what are the estimated maintenance
														costs for the system?
													</span>
													<input
														{...register("estimatedMaintenanceCost")}
														className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
														type='number'
													/>
												</label>
											</>
										) : installationTeam === "Needs team" ? (
											<>
												<label className='flex flex-col mt-[8px]'>
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
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												How much do you want to raise for this project?
											</span>
											<input
												{...register("fundsRequested")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
									</>
								)}
							</>
						)}
					</>
				) : (
					<div>
						{projectType === "Tree" && (
							<div className='grid grid-cols-2'>
								{treeProjectType && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Tree Project Type:
										</span>
										<br />
										{treeProjectType}
									</p>
								)}
								{treeTarget && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Tree Target:
										</span>
										<br />
										{treeTarget} trees
									</p>
								)}
								{treeType && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Tree Type:
										</span>
										<br />
										{treeType}
									</p>
								)}
								{estSeedCost && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Est Seed Costs:
										</span>
										<br />${estSeedCost.toLocaleString()}
									</p>
								)}
								{estLabourCost && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Est Labour Costs:
										</span>
										<br /> ${estLabourCost.toLocaleString()}
									</p>
								)}
								{estMaintenanceCost && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Est Maintenance Costs:
										</span>
										<br /> ${estMaintenanceCost.toLocaleString()} per year
									</p>
								)}
								{estPlantingDate && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Est Planting Date:
										</span>
										<br /> {moment(estPlantingDate).format("MMMM DD, YYYY")}
									</p>
								)}
								{estMaturityDate && (
									<p>
										<span className='mb-[4px] mt-2 font-bold text-gray-400'>
											Est Maturity Date:
										</span>
										<br /> {moment(estMaturityDate).format("MMMM DD, YYYY")}
									</p>
								)}
							</div>
						)}
					</div>
				)}
				<button
					className='mb-4 mt-2 text-left w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					onClick={(e) => handleEditProjectDetails(e)}
				>
					{showEditProjectDetails ? "Close" : "Edit"}
				</button>
				<br />
				<label>
					<span className='my-4'>Project Videos:</span>
					<p className='text-sm'>
						Add urls for videos you want to share with your project from
						YouTube, Vimeo, Wistia, or Twitch!
					</p>

					{project && (
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
					)}
				</label>
				<br />
				<label>
					<span className='my-4'>Project Images:</span>

					{project && user.id !== "" && (
						<ImageUpload
							onUpload={onUpload}
							removeImageUrl={removeImageUrl}
							register={register}
							images={images}
							setImages={setImages}
							userId={user?.id!}
							projectId={project?.id!}
						/>
					)}
				</label>
				<br />
				{!isNonProfit && locationType !== "Residential" && (
					<>
						<label className='flex flex-col md:w-full'>
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
								<label className='flex flex-col md:w-full'>
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
								<label className='flex flex-col md:w-full'>
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
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Name:</span>
					<input
						{...register("coordinatorName", { required: true })}
						type='text'
						className='border-2 border-gray-300 rounded-md p-2 w-full'
					/>
				</label>

				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Phone:</span>
					<input
						{...register("coordinatorPhone", { required: true })}
						type='tel'
						className='border-2 border-gray-300 rounded-md p-2 w-full'
					/>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Description:</span>
					<textarea
						{...register("description", { required: true })}
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 h-[150px] w-full'
					/>
				</label>
				<br />
				<button
					type='submit'
					className='mt-[16px] bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
				>
					Update Project
				</button>
			</form>
		</div>
	);
}

export default withAuth(Edit);
