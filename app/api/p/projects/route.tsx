import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { producerId, projectId, options } = await req.json();
	if (producerId) {
		const { data, error } = await supabase
			.from("projects")
			.select(
				"*, project_milestones(*), tree_projects(*), energy_projects(*), solar_projects(*), project_financials(*)"
			)
			.eq("producer_id", producerId)
			.neq("is_deleted", true)
			.order("status", { ascending: false });

		if (error) {
			console.error("Error fetching projects:", error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		if (data) {
			return NextResponse.json({ data });
		}
	}

	if (projectId) {
		const { data, error } = await supabase
			.from("projects")
			.select(options.query || "*")
			.eq("id", projectId)
			.neq("is_deleted", true);
		if (error) {
			console.error("Error fetching project:", error.message);
			return NextResponse.json(
				{ error: error.message, query: options.query },
				{ status: 500 }
			);
		}
		if (data) {
			return NextResponse.json({ data, query: options.query }, { status: 200 });
		}
	}
}
