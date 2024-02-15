import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
function capitalizeName(fullName: string): string {
	if (!fullName) return "";
	const names = fullName.split(" ");

	const capitalizedNames = names.map((name) => {
		return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	});

	return capitalizedNames.join(" ");
}
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	// Function to check if an email contains 'test' or 'Test' in the alias
	const isTestEmail = (email: string) => {
		const localPart = email.split("@")[0];
		return localPart.includes("+test") || localPart.includes("+Test");
	};

	// Function to check if the last name contains 'Test-'
	const hasTestLastName = (name: string) => {
		if (!name) return false;
		return name && name?.split(" ").some((part) => part.startsWith("Test-"));
	};

	try {
		// Fetch users from the "users" table
		const { data: usersData, error: usersError } = await supabase
			.from("users")
			.select("name, email, created_at")
			.eq("is_verified", true)
			.neq("name", null)
			.order("created_at", { ascending: false })
			.limit(5);

		// Fetch users from the "waiting_list" table
		const { data: waitingListData, error: waitingListError } = await supabase
			.from("waiting_list")
			.select("name, email, created_at")
			.eq("email_verified", true)
			.order("created_at", { ascending: false })
			.limit(5);

		if (usersError || waitingListError) {
			throw new Error(usersError?.message || waitingListError?.message);
		}

		// Refactored data combining, filtering, sorting, and slicing
		const combinedData = [...usersData, ...waitingListData]
			.filter(
				(user) => !isTestEmail(user.email) && !hasTestLastName(user?.name)
			)
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			)
			.slice(0, 5)
			.map((user) => ({
				...user,
				name: capitalizeName(user?.name),
			}));

		return NextResponse.json(combinedData, { status: 200 });
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 501 }
		);
	}
}
