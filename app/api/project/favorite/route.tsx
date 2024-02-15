import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { projectId, userId } = await req.json();
	const { data: favorite, error } = await supabase
		.from("favorites")
		.insert([{ user_id: userId, project_id: projectId }]);
	if (error) {
		console.error("Error creating favorite:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(
		{ message: "Project added to favorites" },
		{ status: 200 }
	);
}
export async function DELETE(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("projectId");
	const projectId = searchParams.get("projectId");
	const { error } = await supabase
		.from("favorites")
		.delete()
		.eq("user_id", userId)
		.eq("project_id", projectId);
	if (error) {
		console.error("Error deleting favorite:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(
		{ message: "Project removed from favorites" },
		{ status: 200 }
	);
}

export async function GET(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("userId");
	const projectId = searchParams.get("projectId");
	const { data: favorites, error } = await supabase
		.from("favorites")
		.select("*")
		.eq("user_id", userId)
		.eq("project_id", projectId);
	if (error) {
		console.error("Error fetching favorites:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	const { count, error: favoriteCountError } = await supabase
		.from("favorites")
		.select("*", { count: "exact" })
		.eq("project_id", projectId);
	if (favoriteCountError) {
		return console.log(favoriteCountError.message);
	}
	if (favorites.length > 0) {
		return NextResponse.json(
			{ favorited: true, count: count, message: "Project is favorited" },
			{ status: 200 }
		);
	} else {
		return NextResponse.json(
			{ favorited: false, count: count, message: "Project is not favorited" },
			{ status: 200 }
		);
	}
}
