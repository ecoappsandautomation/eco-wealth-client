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
	uploadMethod: boolean;
	treeProjectType: string;
	treeType: string;
	energyType: string;
	totalArea: number;
	properties: Property[]; // Replace 'Property' with the actual type
	projectAddressId: string;
	projectBannerUrl: string;
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
			uploadMethod: true,
			treeType: "",
			treeProjectType: "",
			energyType: "",
			totalArea: 0,
			properties: [],
			projectAddressId: "",
			projectBannerUrl: "",
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

	// Note to future me - Might need to update everything to 'watch' for react-hook-form
	const createProject = async (bannerUrl: string) => {
		const projectData = {
			title: formValues.title,
			imageUrl: bannerUrl,
			projectCoordinatorContact: {
				name: formValues.coordinatorName,
				phone: formValues.coordinatorPhone,
			},
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
			.post("/api/projects", { projectData, producerId })
			.then((response: any) => {
				console.log("Project Created: ", response.data);
				toast.success("Project created successfully!");
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
		let fileUploadName = fileName;
		if ((formValues.imageFile as FileList).length > 0) {
			try {
				await uploadImage((formValues.imageFile as FileList)[0]);
			} catch (error) {
				toast.error(`Error uploading image. ${error}`);
				console.log("error uploading image: ", error);

				setLoading({ loading: false, message: "" });
				// Delete the uploaded image if the project update fails
				if (fileUploadName) {
					const { error: deleteError } = await supabase.storage
						.from("projects")
						.remove([fileUploadName]);

					if (deleteError) {
						console.error("Error deleting the uploaded image:", deleteError);
					}
				}
				return;
			} finally {
				const fileExt = (formValues.imageFile as FileList)[0].name
					.split(".")
					.pop();

				if (fileName === "") {
					fileUploadName = `${Math.random()}.${fileExt}`;
				}
				const filePath = `projects/${user.id}/${fileUploadName}`;
				const { data: publicURL } = supabase.storage
					.from("projects")
					.getPublicUrl(filePath);
				if (!publicURL) {
					throw new Error("Error uploading image");
				}
				if (publicURL.publicUrl) {
					createProject(publicURL.publicUrl);
				}
			}
		} else if (formValues.imageUrlInput) {
			createProject(formValues.imageUrlInput);
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
						<label className='my-4 md:w-[800px]'>
							<span className=''>Project Banner Image:</span>
							<div className='flex flex-col'>
								<button
									type='button'
									onClick={toggleUploadMethod}
									className='text-xs mb-[4px] my-2 text-left mr-2 w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold p-1 rounded transition-colors cursor-pointer'
								>
									{uploadMethod ? (
										<span className='flex items-center'>
											<HiSwitchHorizontal className='mr-[4px] text-xl' />
											Enter URL
										</span>
									) : (
										<span className='flex items-center'>
											<HiSwitchHorizontal className='mr-[4px] text-xl' />
											Upload Image
										</span>
									)}
								</button>
								{uploadMethod ? (
									<input
										{...register("imageFile")}
										type='file'
										accept='image/png, image/jpeg'
										className='w-[max-content] border-2 border-gray-300 mt-[2px] rounded-md p-2 cursor-pointer !text-gray-200 tracking-wide file:cursor-pointer file:bg-[var(--cta-one)] file:hover:bg-[var(--cta-one-hover)] file:px-4 file:py-2 file:text-white file:rounded file:font-semibold file:transition-colors'
									/>
								) : (
									<label className='flex flex-col md:w-[800px]'>
										<span className='mb-[4px] '>Paste direct image URL:</span>
										<input
											{...register("imageUrlInput")}
											type='text'
											className='border-2 border-gray-300 rounded-md p-2 w-full'
										/>
									</label>
								)}
							</div>
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
