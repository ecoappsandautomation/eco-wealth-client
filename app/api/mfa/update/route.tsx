import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { userId } = await req.json();
	if (!userId)
		return NextResponse.json(
			{ message: "No user id was provided." },
			{ status: 400 }
		);
	const { data, error } = await supabase
		.from("users")
		.update({ mfa_verified: false })
		.eq("id", userId);

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}

	if (data) {
		return NextResponse.json({ message: "MFA unverified." }, { status: 200 });
	}
	return NextResponse.json(
		{ message: "Could not update MFA." },
		{ status: 502 }
	);
}
