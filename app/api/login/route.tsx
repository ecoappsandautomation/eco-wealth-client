import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
// Timestamp helper functions
function isOlderThan7Days(timestamp: string) {
	if (!timestamp) return false;

	const dateFromTimestamp = new Date(timestamp);
	const now = new Date();
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

	return dateFromTimestamp < sevenDaysAgo;
}

function isOlderThan14Days(timestamp: string) {
	if (!timestamp) return false;

	const dateFromTimestamp = new Date(timestamp);
	const now = new Date();
	const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

	return dateFromTimestamp < fourteenDaysAgo;
}

function isOlderThan28Days(timestamp: string) {
	if (!timestamp) return false;

	const dateFromTimestamp = new Date(timestamp);
	const now = new Date();
	const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

	return dateFromTimestamp < twentyEightDaysAgo;
}

export async function POST(req: NextRequest) {
	const cookieStore = cookies();

	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { email, password } = await req.json();

	// Validate & sanitize email
	if (!validator.isEmail(email)) {
		return NextResponse.json(
			{ error: "Invalid email address" },
			{ status: 400 }
		);
	}
	const sanitizedEmail = sanitizeHtml(email);

	// Login user
	const { data, error } = await supabase.auth.signInWithPassword({
		email: sanitizedEmail,
		password,
	});
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	// Get user data from public.users table
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("*, producers(*), investors(*)")
		.eq("id", data.user.id)
		.single();

	if (userError) {
		return NextResponse.json({ error: userError.message }, { status: 500 });
	}

	// Handle MFA verification
	const checkMFAReverification = (user: any) => {
		const verificationFrequency = user.mfa_frequency;
		const verificationTimestamp = user.mfa_verified_at;
		console.log("verificationFrequency >> ", verificationFrequency);
		switch (verificationFrequency) {
			case "Always":
				return true; // Always reverify
			case "7 Days":
				return isOlderThan7Days(verificationTimestamp);
			case "14 Days":
				return isOlderThan14Days(verificationTimestamp);
			case "28 Days":
				return isOlderThan28Days(verificationTimestamp);
			default:
				return false;
		}
	};
	const handleUnverifiedMFA = async (userId: string) => {
		console.log("MFA is not verified...");
		const { data, error } = await supabase
			.from("users")
			.update({ mfa_verified: false })
			.eq("id", userId);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 501 });
		}
		return NextResponse.json({ message: "MFA unverified." }, { status: 200 });
	};

	if (userData.mfa_enabled && userData.mfa_verified) {
		console.log("MFA is enabled and verified");
		const shouldVerify = checkMFAReverification(userData);
		console.log("shouldVerify", shouldVerify);
		if (shouldVerify) {
			console.log("MFA should be verified");
			await handleUnverifiedMFA(userData.id);
			return NextResponse.json({
				user: userData,
				mfaVerified: false,
				mfaEnabled: userData.mfa_enabled,
				onboardingComplete: userData.onboarding_complete,
				activeRole: userData.active_role,
			});
		}
	}
	if (userData.mfa_enabled && !userData.mfa_verified) {
		console.log("MFA is enabled but not verified");
		await handleUnverifiedMFA(userData.id);
		return NextResponse.json({
			user: userData,
			mfaVerified: false,
			mfaEnabled: userData.mfa_enabled,
			onboardingComplete: userData.onboarding_complete,
			activeRole: userData.active_role,
		});
	}
	if (!userData.mfa_verified_at) {
		console.log("MFA has no timestamp -- not verified");
		await handleUnverifiedMFA(userData.id);
		return NextResponse.json({
			user: userData,
			mfaVerified: false,
			mfaEnabled: userData.mfa_enabled,
			onboardingComplete: userData.onboarding_complete,
			activeRole: userData.active_role,
		});
	}

	if (!userData.mfa_verified) {
		console.log("MFA is not verified");
		await handleUnverifiedMFA(userData.id);
		return NextResponse.json({
			user: userData,
			mfaVerified: false,
			mfaEnabled: userData.mfa_enabled,
			onboardingComplete: userData.onboarding_complete,
			activeRole: userData.active_role,
		});
	}

	return NextResponse.json({
		user: userData,
		mfaVerified: true,
		onboardingComplete: userData.onboarding_complete,
		activeRole: userData.active_role,
	});
}
