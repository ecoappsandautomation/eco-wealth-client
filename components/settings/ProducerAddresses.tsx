import { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import CityPicker from "../CityPicker";
import postalCodes from "postal-codes-js";
import { BiEdit, BiTrash } from "react-icons/bi";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddressForm from "../AddressForm";
import { toast } from "react-toastify";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import { IoCloseCircle, IoExit } from "react-icons/io5";
import useMediaQuery from "@mui/material/useMediaQuery";
import VerifyPropertyModal from "./VerifyPropertyModal";
import Loading from "../Loading";
type Props = {
	user: UserState;
};

function ProducerAddresses({ user }: Props) {
	const producerId = user.producerId;
	const [properties, setProperties] = useState<Property[]>([]);
	const [addNewAddress, setAddNewAddress] = useState(false);
	const theme = useAppSelector((state: RootState) => state.user?.currentTheme);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const handleOpenCreateModal = () => setOpenCreateModal(true);
	const handleCloseCreateModal = () => setOpenCreateModal(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const handleOpenDeleteModal = () => setOpenDeleteModal(true);
	const handleCloseDeleteModal = () => setOpenDeleteModal(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState("");
	const matches = useMediaQuery("(min-width:768px)");

	const [verifyModalOpen, setVerifyModalOpen] = useState(false);

	const openVerifyModal = () => setVerifyModalOpen(true);
	const closeVerifyModal = () => setVerifyModalOpen(false);

	const [loading, setLoading] = useState(true);
	const createModalStyle = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: matches ? "60vw" : "100vw",
		background: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};
	// Fetch addresses on initial render
	useEffect(() => {
		console.log("producerId >>> ", producerId);
		if (!producerId) return;
		fetchAddresses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [producerId]);

	async function fetchAddresses() {
		console.log("fetching addresses...");
		setProperties([]);
		setLoading(true);
		const res = await axios.get(`/api/properties?producerId=${producerId}`);
		const data = await res.data;
		console.log("data >>> ", data.data);
		setProperties(convertToCamelCase(data.data) as Property[]);
		setLoading(false);
	}

	async function addAddress() {
		setLoading(true);
		await axios
			.post("/api/properties", {
				producerId,
				address: newAddressDetails,
			})
			.then((res) => {
				if (!properties) {
					setProperties([convertToCamelCase(res.data[0])]);
				} else {
					setProperties(() => [...properties, convertToCamelCase(res.data[0])]);
				}
				setAddressDetails({
					addressLineOne: "",
					addressLineTwo: "",
					city: "",
					country: "",
					postalCode: "",
					stateProvince: "",
				});
				setAddNewAddress(false);
				toast.success(`Address added successfully`);
				fetchAddresses();
				handleCloseCreateModal();
				setLoading(false);
			})
			.catch((err) => {
				console.log("err >>> ", err);
				toast.error(`Error adding address: ${err}`);
				setLoading(false);
			});
		// Update local addresses and clear input
	}
	const [newAddressDetails, setNewAddressDetails] = useState<any>({
		addressLineOne: "",
		addressLineTwo: "",
		city: "",
		country: "",
		postalCode: "",
		stateProvince: "",
	});

	const [addressDetails, setAddressDetails] = useState<any>({
		addressLineOne: "",
		addressLineTwo: "",
		city: "",
		country: "",
		postalCode: "",
		stateProvince: "",
	});

	async function updateAddress(addressId: string) {
		await axios
			.put(`/api/properties/update`, {
				addressId: addressId,
				newAddressDetails: newAddressDetails,
				producerId: producerId,
			})
			.then((res) => {
				setProperties((prev) =>
					prev.map((address) =>
						address.id === addressId
							? { ...address, ...convertToCamelCase(res.data[0] as Property[]) }
							: address
					)
				);
			})
			.catch((err) => {
				console.log("err >>> ", err);
			});
	}
	const [disableNextStep, setDisableNextStep] = useState(true);
	const [countryCode, setCountryCode] = useState("");

	const city = useAppSelector((state: RootState) => state.onboarding.city);
	const stateProvince = useAppSelector(
		(state: RootState) => state.onboarding.stateProvince
	);

	// Here we validate the postal code
	const [postalCodeError, setPostalCodeError] = useState(false);

	useEffect(() => {
		const validPostalCode = postalCodes.validate(
			countryCode,
			newAddressDetails.postalCode
		);
		if (validPostalCode === true) {
			setPostalCodeError(false);
		} else {
			setPostalCodeError(true);
		}
	}, [countryCode, newAddressDetails.postalCode]);

	// Here we handle the next step button
	useEffect(() => {
		if (
			newAddressDetails.addressLineOne !== "" &&
			countryCode &&
			!postalCodeError &&
			newAddressDetails.city &&
			newAddressDetails.stateProvince
		) {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [newAddressDetails, countryCode, postalCodeError, city, stateProvince]);
	const handleUpdateAddress = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		updateAddress(selectedPropertyId);
	};

	const handleDeleteAddress = async (addressId: string) => {
		await axios
			.delete(`/api/properties?addressId=${addressId}&producerId=${producerId}`)
			.then((res) => {
				setProperties((prev) =>
					prev.filter((address) => address.id !== addressId)
				);
			})
			.catch((err) => {
				console.log("err >>> ", err);
				toast.error(`Error deleting address: ${err}`);
			});
	};

	if (loading)
		return (
			<div className='md:w-[80%] w-[100%] '>
				<h1 className='text-2xl font-semibold'>Properties</h1>
				<div className='flex justify-between items-center'>
					<Loading />
				</div>
			</div>
		);

	return (
		<div className='md:w-[80%] w-[100%] '>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Properties</h1>
				<div className='flex justify-end md:mt-4'>
					<button
						className={
							addNewAddress
								? "text-white text-opacity-25 p-2 text-2xl"
								: "bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white rounded-md p-2"
						}
						onClick={() => setAddNewAddress(!addNewAddress)}
					>
						{addNewAddress ? <IoCloseCircle /> : `+ New Address`}
					</button>
				</div>
			</div>
			{addNewAddress ? (
				<div className='mb-8'>
					<h2>Add a New Address:</h2>
					<fieldset className='flex flex-col'>
						<legend className='text-xl font-light mb-2'>
							What is the address you will operate your projects on?
						</legend>
						<label
							htmlFor='addressLineOne'
							className='flex items-center '
						>
							Address Line One
						</label>
						<input
							id='addressLineOne'
							type='text'
							value={newAddressDetails.addressLineOne}
							onChange={(e) =>
								setNewAddressDetails({
									...newAddressDetails,
									addressLineOne: e.target.value,
								})
							}
							className='rounded-md  text-lg text-gray-700 p-[4px] outline-[var(--cta-one)] transition-colors'
						/>
						<label
							htmlFor='addressLineTwo'
							className='flex items-center mt-3'
						>
							Address Line Two
						</label>
						<input
							id='addressLineTwo'
							type='text'
							value={newAddressDetails.addressLineTwo}
							onChange={(e) =>
								setNewAddressDetails({
									...newAddressDetails,
									addressLineTwo: e.target.value,
								})
							}
							className='rounded-md text-lg text-gray-700 p-[4px] outline-[var(--cta-one)] transition-colors'
						/>
						<CityPicker
							setCountryCode={setCountryCode}
							setAddress={setNewAddressDetails}
							address={newAddressDetails}
						/>

						{countryCode && (
							<>
								<label
									htmlFor='postalCode'
									className='flex items-center mt-3'
								>
									{countryCode === "CA"
										? "Postal Code"
										: countryCode === "US"
										? "Zip Code"
										: null}{" "}
								</label>
								<input
									id='postalCode'
									type='text'
									maxLength={countryCode === "CA" ? 6 : 5}
									value={newAddressDetails.postalCode}
									onChange={(e) =>
										setNewAddressDetails({
											...newAddressDetails,
											postalCode: e.target.value,
										})
									}
									className='rounded-md w-[300px] text-lg text-gray-700 p-[4px] outline-[var(--cta-one)] transition-colors'
								/>
								{postalCodeError && (
									<p className='text-red-500'>
										Please enter a valid{" "}
										{countryCode === "CA"
											? "postal code."
											: countryCode === "US"
											? "zip code."
											: null}
									</p>
								)}
							</>
						)}
					</fieldset>
					<div className='flex justify-end'>
						<button
							onClick={addAddress}
							className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white rounded-md py-2 px-4 mt-4'
						>
							Add Address
						</button>
					</div>
				</div>
			) : null}

			<h2 className='text-gray-400 mt-4'>Your Addresses:</h2>
			{properties &&
				properties.length > 0 &&
				properties.map(({ id, address, isVerified }) => (
					<div
						key={id}
						className='border-[1px] border-white rounded-md flex justify-between p-4 mt-2 md:mt-4'
					>
						<div>
							<div className='flex'>
								<p
									className={
										isVerified
											? "text-[var(--h-one)] border-[var(--h-one)] border-[1px] rounded-md px-3 py-[4px] w-[max-content]"
											: "text-orange-400 border-orange-400 border-[1px] rounded-md px-3 py-[4px] w-[max-content]"
									}
								>
									{isVerified ? "Address verified" : "Pending verification"}
								</p>
								{!isVerified && (
									<button
										className='text-xs bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] p-2 transition-colors rounded ml-2'
										onClick={openVerifyModal}
									>
										Verify
									</button>
								)}
							</div>
							<p className='mt-3'>{address.addressLineOne}</p>
							<p>{address.addressLineTwo}</p>
							<p>
								{address.city}, {address.stateProvince}, {address.country}
							</p>
							<p>{address.postalCode}</p>
						</div>
						<VerifyPropertyModal
							isOpen={verifyModalOpen}
							onClose={closeVerifyModal}
							address={address}
							fetchAddresses={fetchAddresses}
						/>
						<div className='text-right flex flex-col'>
							<button
								onClick={() => {
									setSelectedPropertyId(id);
									handleOpenCreateModal();
								}}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white rounded-md p-2 mb-2 text-lg'
							>
								<BiEdit />
							</button>
							<Modal
								open={openCreateModal}
								onClose={handleCloseCreateModal}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={createModalStyle}>
									<div className='flex justify-end w-[100%] mt-4'>
										<IoCloseCircle
											onClick={() => handleCloseCreateModal()}
											className='text-3xl text-gray-400 cursor-pointer'
										/>
									</div>
									<AddressForm
										handleUpdateAddress={handleUpdateAddress}
										setAddress={setAddressDetails}
										address={addressDetails}
										initialDetails={address}
										editing={true}
									/>
								</Box>
							</Modal>
							<button
								onClick={handleOpenDeleteModal}
								className='bg-red-500 hover:b-red-600 text-white rounded-md p-2 text-lg'
							>
								<BiTrash />
							</button>
							<Modal
								open={openDeleteModal}
								onClose={handleCloseDeleteModal}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'
							>
								<Box sx={createModalStyle}>
									<h1>Are you sure you want to delete this address?</h1>
									<div className='flex justify-end'>
										<button
											onClick={() => {
												handleDeleteAddress(id);
												handleCloseDeleteModal();
											}}
											className='bg-red-500 hover:bg-red-600 text-white rounded-md p-2 mt-4'
										>
											Yes, delete Address
										</button>
									</div>
								</Box>
							</Modal>
						</div>
					</div>
				))}
		</div>
	);
}

export default ProducerAddresses;
