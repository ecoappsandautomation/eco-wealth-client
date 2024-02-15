import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { theme, userId } = await req.json();
	const { data, error } = await supabase
		.from("users")
		.update({ current_theme: theme })
		.eq("id", userId);

	if (error) {
		console.error("Error updating user theme:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (data) {
		return NextResponse.json(
			{ message: "Theme updated successfully" },
			{ status: 200 }
		);
	}
}
