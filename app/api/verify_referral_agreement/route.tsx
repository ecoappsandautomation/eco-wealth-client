import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import moment from "moment";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { userId } = await req.json();
	// Check if user id was provided
	if (!userId)
		return NextResponse.json(
			{
				verified: false,
				error: "No user id was provided, please provide a user id.",
			},
			{ status: 500 }
		);

	// Get referral ambassador from referral ambassadors table
	const { data, error } = await supabase
		.from("referral_ambassadors")
		.select("*")
		.eq("user_id", userId)
		.single();

	// Return error if there is an error retrieving the referral ambassador
	if (error)
		return NextResponse.json(
			{ verified: false, error: error.message },
			{ status: 500 }
		);

	// If referral ambassador exists, return true along with the referral ambassador id and
	// the date the agreement was accepted
	if (data) {
		if (data.agreement_accepted)
			return NextResponse.json(
				{
					verified: true,
					refId: data.id,
					agreementAcceptedAt: moment(data.agreement_accepted_at).format(
						"dddd MMMM DD, yyyy"
					),
				},
				{ status: 200 }
			);
	}
	// If referral ambassador does not exist, return false
	return NextResponse.json({ verified: false }, { status: 200 });
}
