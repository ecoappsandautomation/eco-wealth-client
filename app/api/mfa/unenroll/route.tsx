import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import validator from "validator";
// import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { factorId, userId, factors } = await req.json();
	if (!factorId)
		return NextResponse.json(
			{ error: "No factorId was provided." },
			{ status: 400 }
		);
	if (!userId)
		return NextResponse.json(
			{ error: "No userId was provided." },
			{ status: 400 }
		);
	if (!factors)
		return NextResponse.json(
			{ error: "No factors were provided." },
			{ status: 400 }
		);
	const { data, error } = await supabase.auth.mfa.unenroll({ factorId });
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (data) {
		if (factors.length === 1) {
			await supabase
				.from("users")
				.update({
					mfa_enabled: false,
				})
				.eq("id", userId);
		}
		return NextResponse.json({ message: "MFA unenrolled." }, { status: 200 });
	}
}
