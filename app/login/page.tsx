"use client";
import React, { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store"; // import your root state and dispatch types from your
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import AuthMFA from "@/components/login/AuthMFA";
import Image from "next/image";
import { BASE_URL } from "@/constants";
import { set } from "react-hook-form";
import axios from "axios";
import DOMPurify from "dompurify";
import validator from "validator";
import isEmail from "validator/lib/isEmail";
export default function Login() {
	const user = useAppSelector((state: RootState) => state.user);
	const isLoggedIn = useAppSelector((state: RootState) => state.user?.loggedIn);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [showMFA, setShowMFA] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(false);

	const [emailValid, setEmailValid] = useState(false);
	const redirectToDashboard = (data: any) => {
		console.log("redirecting to dashboard...");
		const { activeRole } = data;
		const dashboardPath =
			activeRole === "investor"
				? "/i/dashboard"
				: activeRole === "producer"
				? "/p/dashboard"
				: "/";
		router.push(dashboardPath);
	};

	useEffect(() => {
		validator.isEmail(email) ? setEmailValid(true) : setEmailValid(false);
	}, [email]);

	const getUserDetails = (data: any) => {
		return {
			name: data?.name,
			email: data?.email,
			phoneNumber: data?.phone_number,
			isVerified: data?.is_verified,
			roles: data?.roles,
			id: data?.id,
			producerId: data?.producers?.id,
			investorId: data?.investors?.id,
			activeRole: data?.active_role,
			onboardingComplete: data?.onboarding_complete,
			investorOnboardingComplete: data?.investors?.onboarding_complete,
			producerOnboardingComplete: data?.producers?.onboarding_complete,
			emailNotification: data?.email_notification,
			smsNotification: data?.sms_notification,
			pushNotification: data?.push_notification,
			mfaEnabled: data?.mfa_enabled,
			mfaVerifiedAt: data?.mfa_verified_at,
			mfaFrequency: data?.mfa_frequency,
		};
	};

	const userVerificationRouting = () => {
		if (verified && !showMFA) {
			if (isLoggedIn && user?.roles?.length === 0) {
				router.push("/onboarding");
			} else {
				if (isLoggedIn && user?.activeRole === "investor") {
					router.push("/i/dashboard");
				} else if (isLoggedIn && user?.activeRole === "producer") {
					router.push("/p/dashboard");
				} else if (isLoggedIn && user?.activeRole === undefined) {
					router.push("/");
				}
			}
		}
	};

	// This useEffect handles users returning to the login page after already being logged in.
	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		if (isLoggedIn && user.mfaVerified) {
			setShowMFA(false);
			if (!user.onboardingComplete) router.push("/onboarding");
			if (user.activeRole === undefined || user.activeRole === null) {
				if (user.roles.includes("investor")) {
					router.push("/i/dashboard");
					setLoading(false);
				} else if (user.roles.includes("producer")) {
					router.push("/p/dashboard");
					setLoading(false);
				}
			}
			if (user.activeRole === "investor") {
				router.push("/i/dashboard");
				setLoading(false);
			} else if (user.activeRole === "producer") {
				router.push("/p/dashboard");
				setLoading(false);
			}
		}
	}, [isLoggedIn, user, router, verified]);

	async function handleEmailSignIn(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		const sanitizedEmail = DOMPurify.sanitize(email);
		axios
			.post("/api/login", { email: sanitizedEmail, password })
			.then((res) => {
				console.log("res.data >>> ", res.data);
				if (!res.data.mfaVerified) {
					console.log("MFA not verified");
					setVerified(false);
					setShowMFA(true);
				} else {
					console.log("MFA verified");
					setVerified(true);
					userVerificationRouting();
				}
				setLoading(false);
				const userValues = {
					loggedIn: true,
					...getUserDetails(res.data.user),
					mfaVerified: res.data.mfaVerified,
					loadingUser: false,
				};
				dispatch(setUser(userValues));
				if (!res.data.onboardingComplete && res.data.mfaVerified) {
					console.log("user is not onboarded");
					router.push("/onboarding");
				}
				if (res.data.onboardingComplete && res.data.mfaVerified) {
					redirectToDashboard(res.data);
				}

				setLoading(false);
			})
			.catch((err) => {
				console.log("err logging in>>> ", err);
				toast.error(`Error signing you in: ${err.message}, please try again.`);
				setLoading(false);
			});
	}

	const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleCreateAccountLink = () => {
		router.push("/signup");
	};
	const handleReturnHome = () => {
		router.push("/");
	};
	if (BASE_URL === "https://ecowealth.app") return null;
	return (
		<>
			{showMFA ? (
				<div className='flex flex-col items-center justify-center min-h-screen'>
					<AuthMFA
						mfaEnabled={user.mfaEnabled}
						setVerified={setVerified}
						setShowMFA={setShowMFA}
					/>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center min-h-screen px-12'>
					<Image
						src='/white_logo_transparent_background.png'
						width={300}
						height={300}
						alt='Eco Wealth Logo'
						onClick={handleReturnHome}
						className='cursor-pointer'
					/>
					<h2 className='text-gray-800 mb-32 dark:text-gray-400 text-xl'>
						Sign In
					</h2>
					<form
						className='flex flex-col w-full max-w-md'
						onSubmit={handleEmailSignIn}
					>
						<input
							type='email'
							name='email'
							placeholder='Email'
							required
							className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
							onChange={handleEmailInput}
							value={email}
						/>
						<input
							type='password'
							name='password'
							placeholder='Password'
							required
							className='p-2 mb-4 rounded text-black border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
							onChange={handlePasswordInput}
							value={password}
						/>
						<button
							type='submit'
							disabled={loading || !emailValid}
							className={
								loading || !emailValid
									? "p-2 rounded bg-gray-600 text-white font-bold transition-all cursor-default"
									: "cursor-pointer p-2 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)] hover:scale-105"
							}
						>
							{loading ? "Signing you in..." : "Sign in with Email"}
						</button>
					</form>
					<p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
						Need an account?{" "}
						<span
							className='text-[var(--cta-one)] cursor-pointer transition-colors hover:text-[var(--cta-two-hover)]'
							onClick={handleCreateAccountLink}
						>
							Create one here.
						</span>
					</p>
				</div>
			)}
		</>
	);
}
