import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { video_urls, project_id } = await req.json();
	const { data, error } = await supabase
		.from("projects")
		.update({ video_urls })
		.eq("id", project_id);
	if (error) {
		return NextResponse.json(
			{ error: "Failed to update project video URLs" },
			{ status: 500 }
		);
	}
	return NextResponse.json(
		{ data, message: "Videos updated successfully." },
		{ status: 200 }
	);
}
