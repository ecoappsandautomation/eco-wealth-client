"use client";
import React, { useEffect, useState } from "react";
import ProjectDetails from "@/components/ProjectDetails";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/features/userSlice";
import { useSearchParams } from "next/navigation";
import handleReferralId from "@/utils/handleReferralId";
import { supabaseClient } from "@/utils/supabaseClient";
import axios from "axios";
import { set } from "react-hook-form";
type Props = {};

export default function PublicProject({}: Props) {
	const user = useAppSelector((state: RootState) => state.user);
	const supabase = supabaseClient;
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const referralId = searchParams?.get("r");
	// Store referralId in localStorage
	useEffect(() => {
		if (referralId) {
			handleReferralId(referralId);
		}
	}, [referralId]);

	// Here we query public.users for the user's additional profile data
	const fetchUserData = async (userId: string) => {
		console.log("fetching user data...");
		try {
			axios.post(`/api/user`, { userId }).then((res) => {
				const userData = res.data.data;
				const refUser = res.data.refUser;
				console.log("user >>> ", res.data);
				console.log(
					"refUser.agreementAccepted >>>",
					refUser.agreement_accepted
				);
				dispatch(
					setUser({
						...user,
						name: userData.name,
						email: userData.email,
						refAgreement: refUser.agreement_accepted,
						referralId: refUser.id,
						phoneNumber: userData.phone_number,
						isVerified: userData.is_verified,
						roles: userData.roles ? userData.roles : [""],
						id: userData.id,
						investorId: userData?.investors?.id,
						producerId: userData?.producers?.id,
						activeRole: userData.active_role,
						loggedIn: true,
						loadingUser: false,
					})
				);
			});
		} catch {
			console.error("Error fetching user data");
		}
	};

	const checkUserLoggedInStatus = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			fetchUserData(user.id);
		}
	};
	useEffect(() => {
		checkUserLoggedInStatus();
	}, []);

	return (
		<div>
			<ProjectDetails pub={true} />
		</div>
	);
}
