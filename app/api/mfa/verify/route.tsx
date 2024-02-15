import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { verifyCode, userId } = await req.json();
	// Sanitize code
	const sanitizedCode = sanitizeHtml(verifyCode);

	// Check user's MFA factors
	const factors = await supabase.auth.mfa.listFactors();
	if (factors.error) {
		return NextResponse.json({ error: factors.error.message }, { status: 500 });
	}

	// Get user's active TOTP factor
	const totpFactor = factors.data.totp[0];

	if (!totpFactor) {
		return NextResponse.json(
			{ error: "No TOTP factors found!" },
			{ status: 500 }
		);
	}

	const factorId = totpFactor.id;

	const challenge = await supabase.auth.mfa.challenge({ factorId });

	if (challenge.error) {
		return NextResponse.json(
			{ error: challenge.error.message },
			{ status: 500 }
		);
	}

	const challengeId = challenge.data.id;

	// Verify user's MFA code
	const verify = await supabase.auth.mfa.verify({
		factorId,
		challengeId,
		code: sanitizedCode,
	});

	if (verify.error) {
		return NextResponse.json({ error: verify.error.message }, { status: 500 });
	} else {
		// Update user's MFA verification status
		const { error } = await supabase
			.from("users")
			.update({
				mfa_verified: true,
				mfa_verified_at: new Date().toISOString(),
			})
			.eq("id", userId);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		// Great success!
		return NextResponse.json({ data: "MFA verified" }, { status: 200 });
	}
}
