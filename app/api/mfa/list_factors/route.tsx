import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import validator from "validator";
// import sanitizeHtml from "sanitize-html";

export async function GET(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data, error } = await supabase.auth.mfa.listFactors();
	if (error) {
		console.log("error >>> ", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	console.log("unenroll data -> ", data);
	return NextResponse.json(
		{ totp: data?.all, factors: data.totp, factorId: data.totp[0].id },
		{ status: 200 }
	);
}
