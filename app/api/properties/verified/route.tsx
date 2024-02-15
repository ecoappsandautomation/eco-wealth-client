import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { searchParams } = new URL(req.url);
	const producerId = searchParams.get("producerId");
	if (!producerId || producerId === "") {
		return NextResponse.json({ error: "Missing producerId" });
	}

	try {
		const { data: properties, error } = await supabase
			.from("producer_properties")
			.select("*")
			.eq("producer_id", producerId)
			.eq("is_deleted", false)
			.neq("is_verified", false);
		return NextResponse.json({ data: properties });
	} catch (error) {
		return NextResponse.json({
			error: "An error occurred when fetching producer data",
		});
	}
}
