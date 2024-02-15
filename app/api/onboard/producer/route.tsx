import { BASE_URL } from "@/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import shortid from "shortid";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { producerData, userId, producerId } = await req.json();
	const {
		producer_id,
		goals,
		operation_type,
		current_operations,
		property_zone_map,
		address,
	} = producerData;
	const { data: onboardingData, error: onboardingError } = await supabase
		.from("producer_onboarding")
		.insert([
			{
				producer_id,
				goals,
				operation_type,
				current_operations,
				property_zone_map,
			},
		])
		.select();

	if (onboardingError) {
		console.error(
			"Error inserting producer onboarding:",
			onboardingError.message
		);
		return NextResponse.json(
			{ error: onboardingError.message },
			{ status: 500 }
		);
	}

	const { data: producerUpdateData, error: producerError } = await supabase
		.from("producers")
		.update({
			onboarding_complete: true,
			onboarding_id: onboardingData[0]?.id,
		})
		.eq("user_id", userId);
	if (producerError) {
		console.error("Error updating producer onboarding status:", producerError);
		return NextResponse.json({ error: producerError.message }, { status: 500 });
	}
	// Insert a new property into the 'producer_properties' table
	const { data: propertyData, error } = await supabase
		.from("producer_properties")
		.insert([
			{
				producer_id: producerId,
				address,
				is_verified: false,
			},
		])
		.select();
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// If property data is available, insert a new record into the 'producer_verification_codes' table
	if (propertyData) {
		const { data: verificationData, error } = await supabase
			.from("producer_verification_codes")
			.insert([
				{
					producer_id: producerId,
					property_id: propertyData[0].id,
					verification_code: shortid.generate(),
				},
			]);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
	}

	return NextResponse.json(
		{ message: "Property inserted successfully", data: propertyData },
		{ status: 200 }
	);

	// await axios
	// 	.post(`${BASE_URL}/api/properties`, {
	// 		producerId,
	// 		address,
	// 	})
	// 	.then((res) => {
	// 		console.log("Property created: ", res.data);

	// 		return NextResponse.json(
	// 			{ message: "Producer onboarding complete." },
	// 			{ status: 200 }
	// 		);
	// 	})
	// 	.catch((err) => {
	// 		console.log("Error creating property: ", err);
	// 		return NextResponse.json({ error: err.message }, { status: 500 });
	// 	});
}
