import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { userId } = await req.json();
	if (!userId)
		return NextResponse.json(
			{ message: "No user id was provided." },
			{ status: 400 }
		);
	const { data, error } = await supabase
		.from("investors")
		.insert([
			{
				user_id: userId,
			},
		])
		.select();
	if (error) {
		console.error("Error updating user theme:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (data) {
		return NextResponse.json(
			{ data, message: "Investor profile created successfully" },
			{ status: 200 }
		);
	}
}
