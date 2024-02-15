import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import validator from "validator";
// import sanitizeHtml from "sanitize-html";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	// Enroll a new TOTP factor for the currently logged in user.
	const { data, error } = await supabase.auth.mfa.enroll({
		factorType: "totp",
	});
	if (error) {
		if (
			error.message ===
			"Enrolled factors exceed allowed limit, unenroll to continue"
		) {
			const factors = await supabase.auth.mfa.listFactors();
			console.log("factors >>> ", factors?.data?.all);
			if (factors?.data?.all.length === 10) {
				for (let i = 0; i < factors?.data?.all.length; i++) {
					await supabase.auth.mfa.unenroll({
						factorId: factors?.data?.all[i].id,
					});
				}
			}
			console.log("error >>> ", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
	}
	console.log("mfa enroll data >>> ", data);
	// Supabase Auth returns an SVG QR code which you can convert into a data
	// URL that you can place in an <img> tag.
	return NextResponse.json(
		{ factorId: data?.id, qr: data?.totp.qr_code },
		{ status: 200 }
	);
}
