"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { supabaseClient } from "./supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store";

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
	const supabase = supabaseClient;
	return function WithAuthComponent(props: any) {
		const router = useRouter();
		const user = useAppSelector((state: RootState) => state.user);
		const pathname = usePathname();
		const dispatch = useAppDispatch();

		function isOlderThanADay(timestamp: string) {
			// Parse the input timestamp into a Date object
			const dateFromTimestamp = new Date(timestamp);

			// Get the current date and time
			const now = new Date();

			// Subtract 24 hours from the current date
			const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

			// If dateFromTimestamp is older than oneDayAgo, return true
			// otherwise, return false
			return dateFromTimestamp < oneDayAgo;
		}

		// Here we query public.users for the user's additional profile data
		const fetchUserData = async (userId: string) => {
			try {
				const { data, error } = await supabase
					.from("users")
					.select("*, producers(*), investors(*)")
					.eq("id", userId)
					.single();
				if (error) {
					console.error("Error fetching user data:", error.message);

					return null;
				}
				if (data.mfa_verified_at && isOlderThanADay(data.mfa_verified_at)) {
					return router.push("/login");
				}
				console.log("user authenticated.");
				dispatch(
					setUser({
						name: data.name,
						email: data.email,
						phoneNumber: data.phone_number,
						isVerified: data.is_verified,
						roles: data.roles ? data.roles : [""],
						id: data.id,
						investorId: data?.investors?.id,
						producerId: data?.producers?.id,
						activeRole: data.active_role,
						loggedIn: true,
						emailNotification: data.email_notification,
						smsNotification: data.sms_notification,
						pushNotification: data.push_notification,
						onboardingComplete: data.onboarding_complete,
						investorOnboardingComplete: data?.investors?.onboarding_complete,
						investorOnboardingSkipped: data?.investors?.onboarding_skipped,
						producerOnboardingComplete: data?.producers?.onboarding_complete,
						mfaEnabled: data.mfa_enabled,
						mfaVerified: data.mfa_verified,
						mfaVerifiedAt: data.mfa_verified_at,
						mfaFrequency: data.mfa_frequency,
						currentTheme:
							data.current_theme !== null ? data.current_theme : "dark",
						loadingUser: false,
					})
				); // Dispatch a redux action

				// Here we check for the user's active role from supabase and then push them to their
				// respective onboarding page if they haven't completed it yet or we push them to their
				// respective dashboard pages if they have completed their onboarding.

				if (
					data.active_role === "investor" &&
					!data.investors[0].onboarding_complete &&
					!data.investors[0].onboarding_skipped
				) {
					router.push("/i/onboarding/");
				} else if (
					data.active_role === "producer" &&
					!data.producers[0].onboarding_complete
				) {
					router.push("/p/onboarding/");
				} else {
					if (!data.mfa_enabled) {
						console.log("MFA is not enabled");
						return router.push("/setup-mfa");
					}
					if (!data.mfa_verified) {
						console.log("MFA is not verified");
						return router.push("/login");
					}
				}
			} catch (err) {
				console.error("Unexpected error fetching user data:", err);
				return null;
			}
		};

		const checkUserLoggedInStatus = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				fetchUserData(user.id);
			} else {
				if (pathname)
					router.push(`/login?next=${encodeURIComponent(pathname)}`);
				else router.push(`/login`);
			}
		};

		useEffect(() => {
			if (user.loggedIn) {
				let role = null;
				if (pathname?.includes("/i/")) {
					role = "investor";
				} else if (pathname?.includes("/p/")) {
					role = "producer";
				}

				if (role) {
					console.log(
						"user.roles.includes(role) >>> ",
						user.roles.includes(role)
					);

					if (user.roles.includes(role)) {
						if (user.activeRole !== role) {
							// Switch role
							dispatch(setUser({ ...user, activeRole: role }));
						}
						if (
							user.activeRole === "producer" &&
							!user.producerOnboardingComplete
						) {
							return router.push("/p/onboarding");
						}
						if (
							user.activeRole === "investor" &&
							!user.investorOnboardingComplete &&
							!user.investorOnboardingSkipped
						) {
							return router.push("/i/onboarding");
						}
					} else {
						// Redirect to dashboard if user doesn't have role
						router.push(`/onboarding/`);
					}
				}
			} else {
				checkUserLoggedInStatus();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [user, pathname, dispatch, router]);

		return <WrappedComponent {...props} />;
	};
}
