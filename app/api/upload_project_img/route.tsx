import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { files, projectId } = await req.json(); // Assuming filesData is an array of objects containing filePath and file for each file

	// Array to store promises for each upload operation
	const uploadPromises = files.map(
		async ({ name }: { name: string; files: File }) => {
			const filePath = `/projects/${projectId}/${name}`;
			const { data, error } = await supabase.storage
				.from("projects")
				.upload(filePath, files);

			if (error) {
				// If any error occurs during upload, return the error message
				return { error: error.message };
			}

			return { data };
		}
	);

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
