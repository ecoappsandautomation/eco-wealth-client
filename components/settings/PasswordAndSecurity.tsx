import { supabaseClient as supabase } from "@/utils/supabaseClient";
import React, { use, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import UnenrollMFA from "../login/UnenrollMFA";
import EnrollMFA from "../login/EnrollMFA";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import MFAFrequencySelector from "./MFA/MFAFrequencySelector";
type Props = {
	user: UserState;
};

export default function PasswordAndSecurity({ user }: Props) {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [isMfaEnrolled, setIsMfaEnrolled] = useState(false);
	useEffect(() => {
		if (newPassword !== confirmNewPassword) {
			setErrorMessage("New passwords do not match!");
		} else {
			setErrorMessage("");
		}
	}, [newPassword, confirmNewPassword]);

	useEffect(() => {
		if (user?.mfaEnabled) {
			setIsMfaEnrolled(true);
		}
	}, [user]);

	const handleEnrollment = useCallback(() => {
		setIsMfaEnrolled(true);
		toast.success("MFA enrolled successfully");
	}, []);

	const handleCancel = useCallback(() => {
		setIsMfaEnrolled(false);
		toast.success("MFA enrolment cancelled");
	}, []);
	// Here we have a function called setPassword that updates the user's password in the supabase database
	// TODO: Add MFA, email, or SMS verification before updating the password
	const setPassword = async () => {
		setLoading(true);
		await axios
			.post("/api/settings/password", {
				oldPassword,
				newPassword,
			})
			.then((res) => {
				console.log(res.data);
				toast.success("Password updated successfully");
				setLoading(false);
			})
			.catch((err) => {
				toast.error(`Could not update password: ${err.message}`);
				console.log(err);
				setLoading(false);
			});
	};

	const handlePasswordChange = () => {
		if (newPassword !== confirmNewPassword) {
			toast.error("New passwords do not match!");
			return;
		}
		setLoading(true);
		setPassword();
		// Password update logic goes here.
		// You would typically make an API call to the server to update the password.
	};

	return (
		<div className='md:mt-6 md:w-[80%]'>
			<h2 className='md:mb-2 text-2xl font-semibold'>Security</h2>
			<h3 className='mb-3 text-xl font-light text-gray-400'>Update Password</h3>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='old-password'
				>
					Old Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='old-password'
					type='password'
					placeholder='Old password'
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='new-password'
				>
					New Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='new-password'
					type='password'
					placeholder='New password'
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</div>
			<div className='mb-4'>
				<label
					className='block text-sm font-bold mb-2'
					htmlFor='confirm-new-password'
				>
					Confirm New Password
				</label>
				<input
					className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
					id='confirm-new-password'
					type='password'
					placeholder='Confirm new password'
					value={confirmNewPassword}
					onChange={(e) => setConfirmNewPassword(e.target.value)}
				/>
			</div>
			{errorMessage && (
				<p className='text-red-500 text-xs italic'>{errorMessage}</p>
			)}
			<div className='flex justify-end'>
				<button
					className='md:w-[33%] bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					type='button'
					onClick={handlePasswordChange}
				>
					{loading ? "Updating Password..." : "Update Password"}
				</button>
			</div>
			{/* The following block is for MFA settings */}
			<div className='mt-4'>
				<h3 className='mb-3 text-xl font-light flex items-center'>
					<FaLock className='mr-2' />
					Multi-Factor Authentication
				</h3>
				{isMfaEnrolled ? (
					<UnenrollMFA onCancelled={handleCancel} />
				) : user.id ? (
					<EnrollMFA
						onEnrolled={handleEnrollment}
						onCancelled={handleCancel}
					/>
				) : null}
			</div>
			{user.id && (
				<MFAFrequencySelector
					currentFrequency={user.mfaFrequency}
					userId={user.id}
				/>
			)}
		</div>
	);
}
