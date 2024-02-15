import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	const { referralId } = await req.json();
	// Check total number of referral ambassadors
	const { error: referralAmbassadorsError, count: referralAmbassadorsCount } =
		await supabase.from("referral_ambassadors").select("*", { count: "exact" });

	// Check total number of referrals
	const { data: totalReferrals, error: totalReferralsError } = await supabase
		.from("total_referrals_view")
		.select("*");

	console.log("referralId >> ", referralId);
	const { data: userReferrals, error: userReferralsError } = await supabase
		.from("total_user_referrals_view")
		.select("*")
		.eq("referred_by", referralId);
	// Return error if there is an error retrieving the total number of referral ambassadors or total number of referrals
	if (referralAmbassadorsError || totalReferralsError || userReferralsError) {
		return NextResponse.json(
			{
				message:
					referralAmbassadorsError?.message ||
					totalReferralsError?.message ||
					userReferralsError?.message,
			},
			{ status: 501 }
		);
	}
	// Calculate total potential payout for all referrals
	const totalPotentialPayout = totalReferrals[0].total_referrals * 25; // $25 per referral

	// Return total number of referrals, total potential payout, and total number of referral ambassadors
	return NextResponse.json(
		{
			totalReferrals: totalReferrals[0].total_referrals,
			totalPotentialPayout: totalPotentialPayout,
			totalReferralAmbassadors: referralAmbassadorsCount,
			totalUserReferrals: userReferrals[0].total_referrals || 0,
			totalUserPotentialPayout: userReferrals[0].total_referrals * 25 || 0,
		},
		{ status: 200 }
	);
}
