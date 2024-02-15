import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { oldPassword, newPassword } = await req.json();
	const { data, error } = await supabase.rpc("change_user_password", {
		current_plain_password: oldPassword,
		new_plain_password: newPassword,
	});

	if (error) {
		console.error("Error updating user password:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(
		{ message: "Password updated successfully!" },
		{ status: 200 }
	);
}
