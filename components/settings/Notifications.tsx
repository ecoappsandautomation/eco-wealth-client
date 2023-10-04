"use client";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import React, { ReactHTMLElement, useState } from "react";
import { toast } from "react-toastify";

type Props = {
	user: UserState;
};

export default function Notifications({ user }: Props) {
	const [email, setEmail] = useState(user.emailNotification ?? false);
	const [sms, setSms] = useState(user.smsNotification ?? false);
	const [app, setApp] = useState(user.pushNotification ?? false);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	// Here we have a function called setNotificationSettings that updates the user's notification settings in the supabase database
	const setNotificationSettings = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("users")
			.update({
				email_notification: email,
				sms_notification: sms,
				push_notification: app,
			})
			.eq("id", user.id);
		if (error) {
			console.log(error.message);
			toast.error(`Could not update notification settings: ${error.message}`);
			return;
		}
		// Here we update redux with the new user details
		dispatch(
			setUser({
				...user,
				emailNotification: email,
				smsNotification: sms,
				pushNotification: app,
			})
		);
		toast.success("Notification settings updated successfully");
		setLoading(false);
	};

	const handleToggleChange = (setter: any) => (event: any) => {
		setter(event.target.checked);
	};
	return (
		<div className='w-[80%]'>
			<div>
				<h2 className='mb-6 text-2xl font-semibold'>Notification Settings</h2>

				<label className='flex items-center cursor-pointer mb-8'>
					<div className='ml-3 font-medium mr-4 '>Email Notifications</div>
					<div className='relative'>
						<input
							type='checkbox'
							className={"sr-only"}
							checked={email}
							onChange={handleToggleChange(setEmail)}
						/>
						<div
							className={
								email
									? "block bg-green-600 w-14 h-8 rounded-full"
									: "block bg-gray-600 w-14 h-8 rounded-full"
							}
						></div>
						<div
							className={
								email
									? "dot transform translate-x-6 absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
									: "dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
							}
						></div>
					</div>
				</label>
			</div>

			<div>
				<label className='flex items-center cursor-pointer mb-8'>
					<div className='ml-3 font-medium mr-4'>SMS Notifications</div>
					<div className='relative'>
						<input
							type='checkbox'
							className='sr-only'
							checked={sms}
							onChange={handleToggleChange(setSms)}
						/>
						<div
							className={
								sms
									? "block bg-green-600 w-14 h-8 rounded-full"
									: "block bg-gray-600 w-14 h-8 rounded-full"
							}
						></div>
						<div
							className={
								sms
									? "dot transform translate-x-6 absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
									: "dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
							}
						></div>
					</div>
				</label>
			</div>

			<div>
				<label className='flex items-center cursor-pointer mb-8'>
					<div className='ml-3 font-medium mr-4'>App Notifications</div>
					<div className='relative'>
						<input
							type='checkbox'
							className='sr-only'
							checked={app}
							onChange={handleToggleChange(setApp)}
						/>
						<div
							className={
								app
									? "block bg-green-600 w-14 h-8 rounded-full"
									: "block bg-gray-600 w-14 h-8 rounded-full"
							}
						></div>
						<div
							className={
								app
									? "dot transform translate-x-6 absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
									: "dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
							}
						></div>
					</div>
				</label>
			</div>
			<div className='flex justify-end'>
				<button
					className='bg-green-700 text-white px-4 py-2 rounded w-[33%] hover:bg-green-600 transition-colors'
					onClick={setNotificationSettings}
				>
					{loading
						? "Updating Notification Settings..."
						: "Update Notification Settings"}
				</button>
			</div>
		</div>
	);
}
