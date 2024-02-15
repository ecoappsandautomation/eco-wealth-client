import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import validator from "validator";
// import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	const { verifyCode, userId, factorId } = await req.json();

	const challenge = await supabase.auth.mfa.challenge({ factorId });
	if (challenge.error) {
		return NextResponse.json(
			{ error: challenge.error.message },
			{ status: 500 }
		);
	}

	const challengeId = challenge.data.id;

	const verify = await supabase.auth.mfa.verify({
		factorId,
		challengeId,
		code: verifyCode,
	});
	if (verify.error) {
		return NextResponse.json({ error: verify.error.message }, { status: 500 });
	} else {
		await supabase
			.from("users")
			.update({
				mfa_enabled: true,
			})
			.eq("id", userId);
		return NextResponse.json(
			{ message: "MFA enabled successfully" },
			{ status: 200 }
		);
	}
}
