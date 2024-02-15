import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { options, userId } = await req.json();

	// log the heck out
	await supabase.auth.signOut();

	// Update user's MFA verification status
	if (options.setMFAFalse) {
		await supabase
			.from("users")
			.update({
				mfa_verified: false,
			})
			.eq("id", userId);
	}
	return NextResponse.json({ message: "Logged out" });
}
