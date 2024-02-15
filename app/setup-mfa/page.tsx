"use client";
import EnrollMFA from "@/components/login/EnrollMFA";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useCallback, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { setUser } from "@/redux/features/userSlice";
import withAuth from "@/utils/withAuth";
import { RootState } from "@/redux/store";
import axios from "axios";
type Props = {};

function SetupMfa({}: Props) {
	const [isMfaEnrolled, setIsMfaEnrolled] = useState(false);
	const router = useRouter();
	const handleEnrollment = useCallback(() => {
		setIsMfaEnrolled(true);
		toast.success("MFA enrolled successfully");
		dispatch(setUser({ ...user, mfaEnabled: true }));
	}, []);
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const handleLogout = async () => {
		axios.post("/api/logout", {
			options: { setMFAFalse: false },
			userId: user.id,
		});
		dispatch(
			setUser({
				roles: [],
				loggedIn: false,
				id: null,
				activeRole: null,
				currentTheme: null,
				email: null,
				name: null,
				phoneNumber: null,
				isVerified: false,
				totalUserTreeCount: 0,
				userTreeCount: 0,
				onboardingComplete: false,
				investorOnboardingComplete: false,
				producerOnboardingComplete: false,
				emailNotification: false,
				smsNotification: false,
				pushNotification: false,
				mfaVerified: false,
				mfaEnabled: false,
			})
		);
		router.push("/login");
	};

	const handleCancel = useCallback(() => {
		setIsMfaEnrolled(false);
		handleLogout();
		toast.success(
			"You have been logged out.  Please activate MFA to secure your account and login."
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (user?.mfaEnabled) {
			if (
				user?.loggedIn &&
				user?.activeRole === "investor" &&
				user?.mfaVerified
			) {
				router.push("/i/dashboard");
			} else if (
				user?.loggedIn &&
				user?.activeRole === "producer" &&
				user?.mfaVerified
			) {
				router.push("/p/dashboard");
			}
		}
	}, [user]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Image
				src='/white_logo_transparent_background.png'
				width={200}
				height={200}
				alt='EcoWealth Logo'
			/>
			<h3 className='mb-3 text-xl font-light flex items-center'>
				<FaLock className='mr-2' />
				Multi-Factor Authentication
			</h3>
			<p className='text-sm text-center mb-8 opacity-90'>
				Please setup mult-factor authentication with an
				<br /> authenticator app to secure & access your account.
			</p>
			<EnrollMFA
				onEnrolled={handleEnrollment}
				onCancelled={handleCancel}
				enableLogout={true}
				redirectTo='/login'
			/>
		</div>
	);
}

export default withAuth(SetupMfa);
