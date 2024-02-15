import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId } = await req.json();
	// Check if referral id was provided
	if (!refId)
		return NextResponse.json(
			{ error: "No referral id was provided, please provide a referral id." },
			{ status: 500 }
		);

	// Get referral ambassador from user accounts table
	const { data, error } = await supabase
		.from("referral_ambassadors")
		.select("*")
		.eq("id", refId);

	// Return error if there is an error retrieving the referral ambassador
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	// If referral ambassador exists, return true along with the referral ambassador id
	if (data) {
		console.log("ambassador found >>> ", data);
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("*")
			.eq("id", data[0].user_id)
			.single();
		return NextResponse.json(
			{
				referrer: { name: userData.name, userId: userData.id, refId: refId },
				message: "Referral ambassador found.",
			},
			{ status: 200 }
		);
	}
}
