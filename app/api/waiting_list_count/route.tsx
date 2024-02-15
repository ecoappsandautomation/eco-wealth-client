import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	// Function to check if an email contains 'test' or 'Test' in the alias
	const isTestEmail = (email: string) => {
		const localPart = email.split("@")[0];
		return localPart.includes("+test") || localPart.includes("+Test");
	};

	// Function to extract the last name and check if it contains 'Test-'
	const hasTestLastName = (fullName: string) => {
		const parts = fullName.split(" ");
		const lastName = parts[parts.length - 1];
		return lastName.startsWith("Test-");
	};

	try {
		// Fetch users from the "users" table
		const { data: usersData } = await supabase
			.from("users")
			.select("email, name")
			.neq("name", null)
			.eq("is_verified", true);

		// Fetch users from the "waiting_list" table
		const { data: waitingListData } = await supabase
			.from("waiting_list")
			.select("email, name")
			.eq("email_verified", true);

		// Combine and filter emails
		const combinedEmails = [...(usersData || []), ...(waitingListData || [])]
			.filter((user) => !isTestEmail(user.email) && !hasTestLastName(user.name))
			.map((user) => user.email);
		// Count unique emails
		const uniqueEmailsCount = new Set(combinedEmails).size;

		console.log("Total unique non-test users: ", uniqueEmailsCount);
		return NextResponse.json({ count: uniqueEmailsCount }, { status: 200 });
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 501 }
		);
	}
}
