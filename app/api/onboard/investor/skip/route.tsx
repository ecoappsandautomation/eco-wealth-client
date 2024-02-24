import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { userId } = await req.json();

	const { data: investorData, error: investorError } = await supabase
		.from("investors")
		.update({
			onboarding_skipped: true,
		})
		.eq("user_id", userId);
	if (investorError) {
		console.error("Error skipping investor onboarding:", investorError.message);
		return NextResponse.json({ error: investorError.message }, { status: 500 });
	}

	return NextResponse.json(
		{ message: "Investor onboarding skipped." },
		{ status: 200 }
	);
}
