"use client";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
	user: UserState;
};

export default function PersonalDetails({ user }: Props) {
	const [name, setName] = useState(user.name ?? "");
	const [email, setEmail] = useState(user.email ?? "");
	const [phone, setPhone] = useState(user.phoneNumber ?? "");
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	// here we have a function called submitUserDetails that posts the data to the supabase database
	const submitUserDetails = async () => {
		axios
			.post("/api/settings/profile", { name, email, phone, userId: user.id })
			.then((res) => {
				console.log(res.data);
				toast.success("Profile information updated successfully");
			})
			.catch((error) => {
				console.log(error.message);
				toast.error(`Could not update profile information: ${error.message}`);
				dispatch(
					setUser({
						...user,
						name: name,
						email: email,
						phoneNumber: phone,
					})
				);
				setLoading(false);
			});
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		// Here we call the submitUserDetails function to post the data to the database
		submitUserDetails();
	};

	const handleSetNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleSetEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleSetPhoneInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPhone(event.target.value);
	};

	return (
		<div className='md:w-[80%]'>
			<h2 className='md:mb-2 text-2xl font-semibold'>Personal Details</h2>
			<h3 className='mb-3 text-xl font-light text-gray-400'>Contact Info</h3>
			<form onSubmit={handleSubmit}>
				<div className='mb-4'>
					<label
						className='block text-sm font-bold mb-2'
						htmlFor='name'
					>
						Name
					</label>
					<input
						className='text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
						id='name'
						type='text'
						placeholder='Your Name'
						value={name}
						onChange={handleSetNameInput}
					/>
				</div>

				<div className='mb-4'>
					<label
						className='block text-sm font-bold mb-2'
						htmlFor='email'
					>
						Email
					</label>
					<input
						className='text-gray-700  shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
						id='email'
						type='email'
						placeholder='Your Email'
						value={email}
						onChange={handleSetEmailInput}
					/>
				</div>

				<div className='mb-4'>
					<label
						className='block text-sm font-bold mb-2'
						htmlFor='phone'
					>
						Phone Number
					</label>
					<input
						className='text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
						id='phone'
						type='tel'
						placeholder='Your Phone Number'
						value={phone}
						onChange={handleSetPhoneInput}
					/>
				</div>

				<div className='flex justify-end'>
					<button
						className='md:w-[33%] py-2 px-4 rounded mt-4 bg-[var(--cta-one)] text-white focus:outline-none focus:bg-green-500 hover:bg-[var(--cta-one-hover)] transition-colors'
						type='submit'
						disabled={loading}
					>
						{loading
							? "Updating Personal Details..."
							: "Update Personal Details"}
					</button>
				</div>
			</form>
		</div>
	);
}
function submitUserDetails() {
	throw new Error("Function not implemented.");
}
