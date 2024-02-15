import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";

type Props = {
	user: UserState;
};

export default function Roles({ user }: Props) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);

	const handleActivateRole = async (role: string) => {
		setLoading(true);

		// Add the new role to the user's roles array
		const newRoles = [...user.roles, role.toLowerCase()];

		await axios
			.post("/api/settings/roles", { roles: newRoles, userId: user.id, role })
			.then((res) => {
				console.log(res.data);
				dispatch(setUser({ ...user, roles: newRoles }));
				if (role === "investor") router.push("/i/onboarding");
				if (role === "producer") router.push("/p/onboarding");
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				console.log("Error updating user roles:", error.message);
			});

		// Redirect the user to the onboarding section for their new role
	};
	return (
		<div className='md:w-[80%]'>
			<h2 className='mb-6 text-2xl font-semibold'>Roles</h2>
			{["Investor", "Producer"].map((role) => {
				const isActive = user.roles.includes(role.toLowerCase());
				return (
					<div key={role}>
						<div
							className={
								isActive
									? "flex items-center justify-between mb-4 border-[var(--cta-one)] border-2 py-4 px-6 rounded-md"
									: "flex items-center justify-between mb-4 border-green-100 border-2 py-4 px-6 rounded-md hover:border-[var(--cta-two-hover)] transition-colors hover:text-[var(--cta-two-hover)]"
							}
						>
							<h2
								className={
									isActive ? "text-[var(--cta-one)] text-xl" : "text-xl"
								}
							>
								{role}
							</h2>
							{isActive ? (
								<p className='text-[var(--cta-one)] font-semibold text-xl'>
									Activated
								</p>
							) : (
								<button
									onClick={() => handleActivateRole(role.toLowerCase())}
									className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-bold py-2 px-4 rounded text-base'
									disabled={isLoading}
								>
									{isLoading ? "Activating account role..." : "Activate now"}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
