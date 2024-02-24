import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});

	// Access FormData directly from the request body
	const formData = await req.formData();
	console.log("formData >>> ", formData);
	// Extract projectId from FormData
	const projectId = formData.get("projectId");
	const files = formData.getAll("files");
	// Check if projectId is provided
	if (!projectId) {
		return NextResponse.json(
			{ error: "Project ID is required" },
			{ status: 400 }
		);
	}
	console.log("files >>> ", files);
	// Array to store promises for each upload operation
	const uploadPromises = [];
	for (const file of files) {
		// Iterate over files directly
		// Upload each file to the storage bucket
		const fileName = file.name || "unnamed-file";
		const filePath = `/projects/${projectId}/${fileName}`;
		const { data, error } = await supabase.storage
			.from("projects")
			.upload(filePath, file);

		if (error) {
			// If any error occurs during upload, return the error message
			return NextResponse.json(
				{ error: `Error uploading file '${fileName}': ${error.message}` },
				{ status: 500 }
			);
		}

		uploadPromises.push({ data });
	}

	// Execute all upload promises concurrently
	const results = await Promise.all(uploadPromises);

	// Check for any errors in the results
	const hasError = results.some((result) => "error" in result);
	if (hasError) {
		// If any upload failed, return an error response
		return NextResponse.json(
			{ error: "One or more files failed to upload" },
			{ status: 500 }
		);
	}

	// All uploads succeeded, return success response
	return NextResponse.json(
		{ message: "All files uploaded successfully" },
		{ status: 200 }
	);
}
