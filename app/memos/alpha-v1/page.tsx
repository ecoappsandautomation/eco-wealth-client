"use client";
import React, { use, useEffect, useState } from "react";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { RiErrorWarningFill } from "react-icons/ri";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import { CircularProgress } from "@mui/material";
import Logo from "@/components/Logo";
import { HiDocument } from "react-icons/hi";
import { IoDocumentOutline } from "react-icons/io5";
import { isEmailValid } from "@/utils/isEmailValid";
type Props = {};

export default function AlphaV1({}: Props) {
	const [userOnWaitlist, setUserOnWaitlist] = useState(false);
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	// Get email from url param
	const router = useRouter();
	const params = useSearchParams();
	const paramEmail = params?.get("email");
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
		// Check if email is in url param or if user is logged in
		if (!paramEmail && !user.email) return setLoading(false);
		// Check if user is on waitlist with email
		const checkIfUserOnWaitlist = async () => {
			await axios
				.post("/api/verify_waiting_list_registration", { email })
				.then((res) => {
					if (res.data.onWaitlist) {
						// Code block goes here
						setUserOnWaitlist(true);
						setLoading(false);
					}
				})
				.catch((err) => {
					console.log(err);
					setUserOnWaitlist(false);
					setLoading(false);
				});
		};
		checkIfUserOnWaitlist();
	}, [user, dispatch, paramEmail, email]);

	// Set email from url param
	useEffect(() => {
		if (paramEmail) setEmail(paramEmail);
	}, [paramEmail]);

	// Set email from logged in user
	useEffect(() => {
		if (user.email) setEmail(user.email);
	}, [user.email]);

	// Handle verify email click
	const handleVerifyEmailClick = async () => {
		if (!isEmailValid(email))
			return setEmailError("Please enter a valid email");
		setLoading(true);
		await axios
			.post("/api/verify_waiting_list_registration", { email })
			.then((res) => {
				if (res.data.onWaitlist) {
					// Code block goes here
					setUserOnWaitlist(true);
					setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
				setUserOnWaitlist(false);
				setLoading(false);
			});
	};

	// Navigate to memo
	const googleDocUrl =
		"https://docs.google.com/document/d/1i34086N8Frdbfjsor-BmI_j-XMq1l8C6YxFRBKfmSVE/edit?usp=sharing";
	const handleMemoLinkClick = () => {
		router.push(googleDocUrl);
	};

	// Link to join waiting list
	const handleWaitingListClick = () => router.push("/register");

	// Render view with no access if no email param or not logged in
	if (!userOnWaitlist)
		return (
			<div className='flex flex-col items-center justify-center min-h-screen '>
				<div className='border border-yellow-600 rounded-md p-8 flex items-center'>
					<RiErrorWarningFill className='text-6xl text-yellow-600 mr-2' />
					<p>Only people registered for the waitlist can access this file.</p>
				</div>
				{loading && email && (
					<div className='flex items-center mt-8'>
						<CircularProgress
							color='success'
							className='text-lg mr-4'
						/>
						<p>Checking waitlist status for {email}</p>
					</div>
				)}
				{!loading && (
					<div className='mt-4 '>
						{paramEmail ? (
							<div>
								<p>Waiting list registration not found for {email}.</p>
								<input
									type='email'
									placeholder='Enter your email'
									className='border border-gray-300 rounded-md px-4 py-2'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<button
									onClick={handleVerifyEmailClick}
									className='ml-2 mt-4 cursor-pointer transition-all hover:scale-105 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-xs md:text-lg lg:px-8 px-4 py-2'
								>
									Access memo
								</button>
							</div>
						) : (
							<div>
								<input
									type='email'
									placeholder='Enter your email'
									className='border border-gray-300 rounded-md px-4 py-2'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<button
									onClick={handleVerifyEmailClick}
									className='ml-2 mt-4 cursor-pointer transition-all hover:scale-105 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-xs md:text-lg lg:px-8 px-4 py-2'
								>
									Access memo
								</button>
							</div>
						)}
						{emailError && <p style={{ color: "red" }}>{emailError}</p>}
						<p className='mt-8 mb-2'>Not on the waiting list yet? Join here:</p>
						<button
							className='cursor-pointer transition-all hover:scale-105 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-xs md:text-lg lg:px-8 px-4 py-2 glow'
							onClick={handleWaitingListClick}
						>
							Join the waiting list today
						</button>
					</div>
				)}
			</div>
		);

	// Render view with memo access if email is on waitlist
	if (userOnWaitlist)
		return (
			<div className='flex flex-col items-center justify-center min-h-screen '>
				<div className='border border-white rounded-md p-8'>
					<Logo />
					<h1 className='text-3xl font-semibold pb-8 flex items-center'>
						<IoDocumentOutline className='mr-2' /> Access the memo here:
					</h1>
					<button
						onClick={handleMemoLinkClick}
						className='cursor-pointer py-2 px-8 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)] hover:scale-105'
					>
						Open Alpha v1 Google Doc
					</button>
				</div>
			</div>
		);
}
