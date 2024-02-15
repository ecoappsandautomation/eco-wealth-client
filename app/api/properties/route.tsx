import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import shortid from "shortid";
import convertToCamelCase from "@/utils/convertToCamelCase";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { producerId, address } = await req.json();

	// Check if producerId and address details are provided
	if (!producerId) {
		return NextResponse.json(
			{ error: "Missing producerId in request body" },
			{ status: 400 }
		);
	}
	if (
		!address.addressLineOne ||
		!address.city ||
		!address.stateProvince ||
		!address.postalCode ||
		!address.country
	) {
		return NextResponse.json(
			{ error: "Missing address details in request body" },
			{ status: 400 }
		);
	}

	// Insert a new property into the 'producer_properties' table
	const { data: propertyData, error } = await supabase
		.from("producer_properties")
		.insert([
			{
				producer_id: producerId,
				address: {
					address_line_one: address.addressLineOne,
					address_line_two: address.addressLineTwo,
					city: address.city,
					state_province: address.stateProvince,
					postal_code: address.postalCode,
					country: address.country,
				},
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
}

export async function DELETE(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const addressId = req?.nextUrl?.searchParams.get("addressId");
	const producerId = req?.nextUrl?.searchParams.get("producerId");
	// Ensure addressId is provided
	if (!addressId) {
		return NextResponse.json(
			{ error: "addressId is required." },
			{ status: 400 }
		);
	}
	if (!producerId) {
		return NextResponse.json(
			{ error: "producerId is required." },
			{ status: 400 }
		);
	}

	const { data, error } = await supabase
		.from("producer_properties")
		.update({
			is_deleted: true,
			is_verified: false,
			deleted_at: new Date(),
			updated_at: new Date(),
		})
		.eq("id", addressId);

	// Handle errors from Supabase
	if (error) {
		console.error("Error deleting property:", error);
		return NextResponse.json(
			{ error: "Error deleting property." },
			{ status: 500 }
		);
	}
	if (data) {
		// Here we update the status of the producer's projects that contain the original addressId to pending_reverification
		const { error: projectUpdateError } = await supabase
			.from("projects")
			.update({
				status: "pending_reverification",
				updated_at: new Date(),
			})
			.eq("property_id", addressId)
			.select();
		if (projectUpdateError) {
			console.error("Error updating project status:", projectUpdateError);
			return NextResponse.json(
				{
					error: `Error updating project status. ${projectUpdateError.message}`,
				},
				{ status: 500 }
			);
		}

		// Here we create a producer_notification record for the producer to notify them that they need to update their project with a new property
		// const { data: notificationData, error } = await supabase
		// 	.from("producer_notifications")
		// 	.insert([
		// 		{
		// 			id: uuidv4(),
		// 			producer_id: producerId,
		// 			notification_type: "update_property",
		// 			notification_data: {
		// 				message:
		// 					"Your project is missing an address.  You need to update your project with a new property.",
		// 				project_id: projectData[0].id,
		// 			},
		// 		},
		// 	])
		// 	.select();
	}

	// Return message to client
	return NextResponse.json(
		{ message: "Property deleted successfully." },
		{ status: 200 }
	);
}

export async function PATCH(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});

	const { addressId, newAddressDetails, producerId } = await req.json();

	// Validation
	if (!addressId) {
		return NextResponse.json({ error: "addressId is required" });
	}

	if (!newAddressDetails || typeof newAddressDetails !== "object") {
		return NextResponse.json(
			{ error: "newAddressDetails is required and must be an object" },
			{ status: 400 }
		);
	}

	const {
		addressLineOne,
		addressLineTwo,
		city,
		country,
		postalCode,
		stateProvince,
	} = newAddressDetails;

	try {
		const { data, error } = await supabase
			.from("producer_properties")
			.update({
				address: {
					address_line_one: addressLineOne,
					address_line_two: addressLineTwo,
					city: city,
					country: country,
					postal_code: postalCode,
					state_province: stateProvince,
				},
				is_verified: false,
				updated_at: new Date(),
			})
			.eq("id", addressId)
			.select();

		if (error) {
			return NextResponse.json({ error: error.message });
		}
		if (data) {
			const { data: verificationData, error: verificationError } =
				await supabase.from("producer_verification_codes").insert([
					{
						producer_id: producerId,
						property_id: addressId,
						verification_code: shortid.generate(),
					},
				]);
			// TODO: Notify team member for verification code mailout or phone call
			if (verificationError) {
				return NextResponse.json(
					{ error: verificationError.message },
					{ status: 500 }
				);
			}
		}
		return NextResponse.json({ data }, { status: 200 });
	} catch (error) {
		console.error("Error updating property:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	let producerId = req?.nextUrl?.searchParams.get("producerId");
	if (!producerId) {
		return NextResponse.json(
			{ error: "producerId is required" },
			{ status: 400 }
		);
	}

	const { data, error } = await supabase
		.from("producer_properties")
		.select("*")
		.eq("producer_id", producerId)
		.eq("is_deleted", false)
		.order("is_verified", { ascending: false });

	if (error) {
		console.error("Error fetching properties:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (data && data.length > 0) {
		for (const property of data) {
			if (!property.is_verified) {
				console.log("Property not verified yet:", property.id);
				// Check if there is a verification code for this property
				const { data: verificationData, error: verificationError } =
					await supabase
						.from("producer_verification_codes")
						.select("*")
						.eq("producer_id", producerId)
						.eq("property_id", property.id)
						.eq("is_deleted", false);

				if (verificationError) {
					console.error(
						"Error fetching verification codes:",
						verificationError.message
					);
					continue; // Move to the next property
				}
				if (verificationData && verificationData.length === 0) {
					console.log(
						"No verification code found for property, creating a new one:",
						property.id
					);
					// If there is no verification code for this property, create one
					const { data: newVerificationData, error: insertError } =
						await supabase.from("producer_verification_codes").insert([
							{
								producer_id: producerId,
								verification_code: shortid.generate(),
								property_id: property.id,
							},
						]);

					if (insertError) {
						console.error(
							"Error creating verification code:",
							insertError.message
						);
					} else {
						console.log("Verification code created for property:", property.id);
					}
				}
				console.log(
					"Verification code already exists for property:",
					property.id
				);
			}
		}
	} else {
		return NextResponse.json(
			{ message: "No properties found." },
			{ status: 200 }
		);
	}
	return NextResponse.json({ data }, { status: 200 });
}
