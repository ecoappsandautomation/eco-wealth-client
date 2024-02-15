import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { userId } = await req.json();
	if (!userId)
		return NextResponse.json(
			{ error: "No user id was provided, please provide a user id." },
			{ status: 500 }
		);

	const { data, error } = await supabase.from("referral_ambassadors").insert([
		{
			user_id: userId,
			agreement_accepted: true,
			agreement_accepted_at: new Date(),
		},
	]);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true }, { status: 200 });
}
