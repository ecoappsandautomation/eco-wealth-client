import { NextRequest, NextResponse } from "next/server";
import { gen } from "n-digit-token";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { BASE_URL } from "@/constants";
import validator from "validator";
import sanitizeHtml from "sanitize-html";

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function POST(req: NextRequest, res: NextResponse) {
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { name, email, referralSource, referrer, specificReferral } =
		await req.json();
	// Validate & sanitize email
	if (!validator.isEmail(email)) {
		return NextResponse.json(
			{ message: "Invalid email address" },
			{ status: 400 }
		);
	}
	const sanitizedName = sanitizeHtml(name);
	const sanitizedEmail = sanitizeHtml(email);
	const sanitizedReferralSource = sanitizeHtml(referralSource);
	const sanitizedReferrer = sanitizeHtml(referrer);
	const sanitizedSpecificReferral = sanitizeHtml(specificReferral);

	const token: string = gen(333);
	let waitingListData = {};

	if (sanitizedSpecificReferral) {
		waitingListData = {
			name: sanitizedName,
			email: sanitizedEmail,
			referral_source: sanitizedReferralSource,
			referrer: sanitizedReferrer,
			referred_by: sanitizedSpecificReferral,
		};
	} else {
		waitingListData = {
			name: sanitizedName,
			email: sanitizedEmail,
			referral_source: sanitizedReferralSource,
			referrer: sanitizedReferrer,
		};
	}

	const { data, error } = await supabase
		.from("waiting_list")
		.insert([waitingListData])
		.select();

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	const { error: verificationTokenError } = await supabase
		.from("wl_verification_tokens")
		.insert([
			{
				token,
				wl_user_id: data[0].id,
			},
		])
		.select();
	if (verificationTokenError) {
		return NextResponse.json(
			{ message: verificationTokenError.message },
			{ status: 501 }
		);
	}
	function extractFirstName(fullName: string) {
		// Split the full name into an array of words
		const nameParts = fullName.trim().split(" ");

		// Extract the first name (assuming it's the first element of the array)
		const firstName = nameParts[0];

		return firstName;
	}

	const firstName = extractFirstName(name);

	const msg = {
		to: email,
		from: { email: "info@ecowealth.app", name: "Eco Wealth Notifications" },
		subject: `Thank you for registering ${firstName}, please verify your email to join Eco Wealth's waiting list now!`,
		html: `<div style="color:#444444; line-height:20px; padding:16px 16px 16px 16px; text-align:Left;">
        <a href="https://ecowealth.app/"><img src="https://i.postimg.cc/906kN7K3/logo-transparent-background.png" alt="" width="300"/></a><br/>
		<h1>Thank you for registering for Eco Wealth's Waiting List, ${firstName}!</h1>
		<p style="font-size:14px">Please confirm your email to verify your registration: <br/><a href="${BASE_URL}/verify?token=${token}"><button style="background:#40821A; color:white; font-weight:bold; border:none; padding:16px 32px; border-radius:8px; font-size:16px; margin-top:4px;">Confirm email address</button></a></p>
		<p style="font-size:14px">Thank you again ${firstName}, and have a wonderful day!</p>
		<p style="font-size:14px">— Eco Wealth Team</p>
		<br/>
		<p style="font-size:12px; color: #777"><b>Note:</b> If this wasn't you, please let us know by replying back to this email and we'll remove you from the list.</p>
      </div>`,
	};

	await sgMail
		.send(msg)
		.then(() => {
			console.log("verification email sent");
		})
		.catch((error: any) => {
			console.log("error", error);
			return NextResponse.json({ message: error.message }, { status: 501 });
		});

	// TODO: Add to mailing list
	return NextResponse.json({ message: "success" }, { status: 200 });
}
