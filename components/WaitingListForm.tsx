"use client";
import React, { ReactHTML, useEffect, useState } from "react";
import { isEmailValid } from "@/utils/isEmailValid";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import Logo from "./Logo";

import ReCAPTCHA from "react-google-recaptcha";
import validator from "validator";
import addToWaitingList from "@/utils/addToWaitingList";
import CheckReferral from "./home/CheckReferral";
import handleReferralId from "@/utils/handleReferralId";
type Props = {
	formHeight?: string;
	showLogo?: boolean;
};
function WaitingListForm({ formHeight, showLogo = true }: Props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [referralSource, setReferralSource] = useState("");
	const [referrer, setReferrer] = useState("");
	const [specificReferral, setSpecificReferral] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");
	const [captcha, setCaptcha] = useState<string | null>("");
	const RECAPTCHA_SITE_KEY = process.env.recaptcha_site_key;
	const handleCheckReferral = () => {
		if (typeof window !== "undefined") {
			// The code now runs only on the client side

			if (ref) {
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(ref);
				return;
			} else {
				const storedData = localStorage.getItem("referralData");
				if (!storedData) return;
				const { referralId } = JSON.parse(storedData as string);
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(referralId);
			}
		}
	};

	// Check if referralId is present in URL or localStorage
	useEffect(() => {
		// Check if referralId is present in URL
		handleCheckReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);

	// Check if referralId is present in localStorage
	const handleExistingReferral = async (referralId: string) => {
		await handleReferralId(referralId, setReferrer);
	};

	// Handle referral source change
	const handleReferralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setReferralSource(e.target.value);
		setSpecificReferral(""); // Reset specific referral if the referral source is changed
		if (e.target.value !== "Friend/Someone referred") {
			setReferrer("");
		}
	};

	// Render specific referral input based on referral source
	const renderSpecificReferralInput = () => {
		if (referralSource === "Friend/Someone referred") {
			return (
				<div className='flex flex-col mb-4'>
					<label className='mb-2'>Who referred you?</label>
					<input
						type='text'
						value={referrer}
						placeholder='Name and/or email'
						className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
						onChange={(e) => setReferrer(e.target.value)}
					/>
				</div>
			);
		} else if (
			[
				"Instagram",
				"Facebook",
				"YouTube",
				"TikTok",
				"Threads",
				"Blog/Website",
			].includes(referralSource)
		) {
			return (
				<div className='flex flex-col mb-4 w-[300px]'>
					<label className='mb-2'>
						Which {referralSource} account did you hear about Eco Wealth from?
					</label>
					<input
						type='text'
						value={specificReferral}
						placeholder={
							referralSource === "Blog/Website"
								? "Blog/Website name"
								: "@username"
						}
						className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
						onChange={(e) => setSpecificReferral(e.target.value)}
					/>
				</div>
			);
		}
	};
	const router = useRouter();
	const getReferralId = () => {
		const storedData = localStorage.getItem("referralData");
		if (!storedData) return null;
		const { referralId } = JSON.parse(storedData as string);
		return referralId;
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validate email
		console.log("submitting...");
		if (!validator.isEmail(email)) {
			setEmailError("Invalid email address");
			return;
		}
		setEmailError("");

		// Check if referralId is present in URL or localStorage;
		const referralId = getReferralId();
		if (!name || !email || !captcha) return;
		// Send form data to the server

		if (!referralId) {
			// Send form data to the server
			if (referralSource !== "") {
				addToWaitingList({
					name,
					email,
					referralSource,
					referrer,
					specificReferral: referrer !== "" ? referrer : specificReferral,
					router,
				});
			} else {
				addToWaitingList({
					name,
					email,
					router,
				});
			}
		} else {
			addToWaitingList({
				name,
				email,
				referralSource,
				referrer,
				specificReferral,
				referralId,
				router,
			});
		}
	};

	useEffect(() => {
		// Check if all required fields are filled and valid
		const isValid =
			name.trim() !== "" &&
			isEmailValid(email) &&
			captcha !== null &&
			captcha !== "" &&
			captcha !== undefined;
		// Add reCaptcha validation here
		setIsFormValid(isValid);
	}, [name, email, referralSource, referrer, specificReferral, captcha]);
	return (
		<form
			onSubmit={handleSubmit}
			className={`flex flex-col items-center justify-center ${
				formHeight || "min-h-screen"
			}`}
		>
			{/* showLogo - default is true */}
			{showLogo && (
				<Logo
					width={384}
					height={150}
				/>
			)}
			<h2 className='mb-12 lg:text-xl text-gray-400 text-center'>
				Be the first to know when Eco Wealth launches!
			</h2>
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>Name:</label>
				<input
					type='text'
					value={name}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>Email:</label>
				<input
					type='email'
					value={email}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={(e) => setEmail(e.target.value)}
				/>
				{emailError && <p style={{ color: "red" }}>{emailError}</p>}
			</div>
			{/* Referral source dropdown */}
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>How did you hear about Eco Wealth?</label>
				<select
					value={referralSource}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={handleReferralChange}
				>
					<option value=''>Select</option>
					<option value='Instagram'>Instagram</option>
					<option value='Facebook'>Facebook</option>
					<option value='YouTube'>YouTube</option>
					<option value='TikTok'>TikTok</option>
					<option value='Threads'>Threads</option>
					<option value='Blog/Website'>Blog/Website</option>
					<option value='Friend/Someone referred'>
						Friend/Someone referred me
					</option>
				</select>
			</div>

			{/* Conditional text input for referrer */}
			{renderSpecificReferralInput()}
			<ReCAPTCHA
				sitekey={RECAPTCHA_SITE_KEY!}
				onChange={setCaptcha}
				className='rounded-md mx-auto mt-2'
			/>
			<button
				className={
					isFormValid
						? "w-[300px] mt-8 px-4 py-2 rounded-lg bg-[var(--cta-one)] text-white cursor-pointer hover:bg-[var(--cta-one-hover)] transition-all hover:scale-105"
						: "w-[300px] mt-8 px-4 py-2 rounded-lg bg-gray-700 text-white cursor-default"
				}
				type='submit'
				disabled={!isFormValid}
			>
				Join waiting list
			</button>
			<div className='w-[300px] mt-4'>
				<p className='text-xs mt-2 text-gray-500'>
					<BiLock className='inline text-base' />
					<b>Your Privacy:</b> We promise to keep your contact information
					confidential and only contact you with news & updates regarding Eco
					Wealth, and inviting you to test the platform when opportunities
					arise.
				</p>
				<p className='text-xs mt-2 text-gray-500'>
					<b>Note:</b> More details can be found in our{" "}
					<a
						href='/privacy-policy'
						className='underline cursor-pointer hover:text-gray-400 transition-all'
					>
						privacy policy
					</a>
					.
				</p>
			</div>
		</form>
	);
}

export default WaitingListForm;
