import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { userId } = await req.json();
	const { data, error } = await supabase
		.from("producers")
		.insert([
			{
				user_id: userId,
			},
		])
		.select();
	if (error) {
		console.error("Error creating producer profile:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(data, { status: 200 });
}
