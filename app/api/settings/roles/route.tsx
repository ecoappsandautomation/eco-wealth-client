import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});

	const { userId, roles, role } = await req.json();
	// Update the user's roles in Supabase
	const { data, error } = await supabase
		.from("users")
		.update({ roles })
		.eq("id", userId)
		.select();
	if (error) {
		console.error("Error updating user roles:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	console.log("User roles updated:", data);
	// Create investor profile
	if (role === "investor") {
		const { data: investorData, error: investorError } = await supabase
			.from("investors")
			.insert([
				{
					user_id: userId,
				},
			])
			.select();
		if (investorError) {
			console.error("Error creating investor profile:", investorError.message);
			if (
				investorError.message.includes(
					"duplicate key value violates unique constraint"
				)
			) {
				return NextResponse.json(
					{ message: "Producer profile already exists." },
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{ error: investorError.message },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ message: "Investor profile successfully created." },
			{ status: 200 }
		);
	}

	// Create producer profile
	if (role === "producer") {
		const { data: producerData, error: producerError } = await supabase
			.from("producers")
			.insert([
				{
					user_id: userId,
				},
			])
			.select();
		if (producerError) {
			console.error("Error creating producer profile:", producerError.message);
			if (
				producerError.message.includes(
					"duplicate key value violates unique constraint"
				)
			) {
				return NextResponse.json(
					{ message: "Producer profile already exists." },
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{ error: producerError.message },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ message: "Producer profile successfully created." },
			{ status: 200 }
		);
	}
}
