import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { name, email, phone, userId } = await req.json();
	const { data, error } = await supabase
		.from("users")
		.update({
			name,
			email,
			phone_number: phone,
		})
		.eq("id", userId);

	if (error) {
		console.error("Error updating user profile:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data, { status: 200 });
}
