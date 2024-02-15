import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import moment from "moment";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId } = await req.json();
	if (!refId)
		return NextResponse.json(
			{ error: "No referral id was provided, please provide a referral id." },
			{ status: 500 }
		);
	// Get referred users from user accounts table
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("referred_by", refId);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	// Get referred waiting list registrations from waiting list table
	const { data: waitingListData, error: waitingListError } = await supabase
		.from("waiting_list")
		.select("*")
		.eq("referred_by", refId);

	if (waitingListError)
		return NextResponse.json(
			{ error: waitingListError.message },
			{ status: 500 }
		);
	// Restructure the app user registrations array into name, email, dateReferred, and type
	data.map((referral) => {
		referral.name = referral.name;
		referral.email = referral.email;
		referral.dateReferred = moment(referral.created_at).format(
			"dddd MMMM DD, yyyy"
		);
		referral.type = "User Account Registration";
	});

	// Restructure the waiting list array into name, email, dateReferred, and type
	waitingListData.map((referral) => {
		referral.name = referral.name;
		referral.email = referral.email;
		referral.dateReferred = moment(referral.created_at).format(
			"dddd MMMM DD, yyyy"
		);
		referral.type = "Waiting List Registration";
	});

	// Combine referred users and waiting list registrations
	const referrals = data.concat(waitingListData);

	// Return the referrals
	return NextResponse.json(referrals, { status: 200 });
}
