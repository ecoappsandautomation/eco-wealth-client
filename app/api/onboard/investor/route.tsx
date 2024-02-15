import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { investorOnboardingData, userId } = await req.json();
	if (!userId) {
		return NextResponse.json(
			{ message: "No user id was provided." },
			{ status: 400 }
		);
	}
	const {
		id,
		user_id,
		goals,
		sectors,
		renewable_energy_preferences,
		tree_preferences,
		risk_tolerance,
		time_horizon,
		okay_with_investment_fluctuations,
		impact,
		regions,
		is_accredited_investor,
		agreed_to_risk,
	} = investorOnboardingData;
	const { data, error } = await supabase
		.from("investor_onboarding")
		.insert([
			{
				id,
				user_id,
				goals,
				sectors,
				renewable_energy_preferences,
				tree_preferences,
				risk_tolerance,
				time_horizon,
				okay_with_investment_fluctuations,
				impact,
				regions,
				is_accredited_investor,
				agreed_to_risk,
			},
		])
		.select();
	if (error) {
		console.error("Error inserting investor onboarding:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	const { data: investorData, error: investorError } = await supabase
		.from("investors")
		.update({
			onboarding_complete: true,
			onboarding_id: data[0]?.id,
		})
		.eq("user_id", userId);
	if (investorError) {
		console.error("Error updating investor:", investorError.message);
		return NextResponse.json({ error: investorError.message }, { status: 500 });
	}
	if (data) {
		return NextResponse.json(
			{ message: "Investor onboarded successfully" },
			{ status: 200 }
		);
	}
}
