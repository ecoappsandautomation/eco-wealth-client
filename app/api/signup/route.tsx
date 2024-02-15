import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/constants";
import { createClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { email, password, referrer, referralSource, specificReferral } =
		await req.json();

	const sanitizedEmail = sanitizeHtml(email);
	const sanitizedReferrer = sanitizeHtml(referrer);
	const sanitizedReferralSource = sanitizeHtml(referralSource);
	const sanitizedSpecificReferral = sanitizeHtml(specificReferral);

	console.log("referrer >>> ", referrer);
	console.log("referralSource >>> ", referralSource);
	console.log("specificReferral >>> ", specificReferral);

	const { error, data } = await supabase.auth.signUp({
		email: sanitizedEmail,
		password,
		options: {
			emailRedirectTo: `${BASE_URL}/auth/callback`,
		},
	});

	if (error) {
		console.error("Error signing up:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (data) {
		console.log("new account user data >>> ", data);
		if (!referrer) {
			return NextResponse.json({ data });
		}
		const { data: userData, error: userError } = await supabase
			.from("users")
			.update({
				referred_by: sanitizedReferrer,
				referral_source: sanitizedReferralSource,
				specific_referral: sanitizedSpecificReferral,
			})
			.eq("id", data.user?.id);

		if (userError) {
			console.error("Error updating user:", userError.message);
			return NextResponse.json({ error: userError.message }, { status: 500 });
		}
		console.log("user data >>> ", userData);
		return NextResponse.json({ data: userData });
	}
	return NextResponse.json(
		{ error: "User signup could not be completed." },
		{ status: 500 }
	);
}
