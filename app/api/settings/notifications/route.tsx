import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { email, sms, app, userId } = await req.json();
	const { data, error } = await supabase
		.from("users")
		.update({
			email_notification: email,
			sms_notification: sms,
			push_notification: app,
		})
		.eq("id", userId);
	if (error) {
		console.error("Error updating user notification settings:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data, { status: 200 });
}
