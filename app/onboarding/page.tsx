"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/features/userSlice"; // You need to create this action
import { RootState } from "@/redux/store"; // You need to create this file
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import supabase from "@/utils/supabaseClient";
import withAuth from "@/utils/withAuth";

const Onboarding: FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);
	const [role, setRole] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [step, setStep] = useState(0);

	//  Here we update the user's role in the database and redux store
	const updateUserRole = async (role: string) => {
		dispatch(setUser({ ...user, roles: [role], active_role: role }));
		const { data, error } = await supabase
			.from("users")
			.update({ name: name, roles: [role], active_role: role })
			.eq("id", user.id);
		if (error) {
			console.error("Error updating user role:", error.message);
			setLoading(false);
		}
		if (data) {
			setLoading(false);
			if (role === "investor") {
				router.push("/i/onboarding");
			}

			if (role === "producer") {
				router.push("/p/onboarding");
			}
		}
	};

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setLoading(true);
		const accountRole =
			event.currentTarget.getAttribute("data-account-role") || "";
		setRole(accountRole);
		updateUserRole(accountRole);
	};

	const handleNameSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		dispatch(setUser({ ...user, name: name }));
		setLoading(false);
		setStep(1);
	};

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	useEffect(() => {
		console.log("user role >>> ", user?.active_role);
		if (user?.active_role === "investor") {
			router.push("/i/dashboard");
		} else if (user?.active_role === "producer") {
			router.push("/p/dashboard");
		}
	}, [user?.active_role, router]);

	switch (step) {
		case 0:
			return (
				<form
					onSubmit={handleNameSubmit}
					className='flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-950 '
				>
					<div>
						<h1 className='text-left mb-4 text-xl text-gray-500 dark:text-white'>
							What&apos;s your name?
						</h1>
						<input
							value={name}
							onChange={handleNameInput}
							className='w-[300px] p-2 mb-4 rounded text-gray-800 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
							type='name'
							placeholder='Full name'
							name='name'
						/>
					</div>
					<div>
						<button
							className={`px-4 py-2 rounded text-white mt-8  ${
								loading
									? "bg-gray-500"
									: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
							}  `}
						>
							Continue to next step
						</button>
					</div>
				</form>
			);

		case 1:
			return (
				<div className='flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-950 '>
					<div className='w-[60%]'>
						<h1 className='mb-2 text-3xl text-gray-500 dark:text-white'>
							👋 Hey {name}, let&apos;s get started!
						</h1>
						<h1 className='mb-2 text-xl text-gray-500 dark:text-white'>
							Which role would you like to begin with on our platform?
						</h1>
						<p className='mb-10 text-gray-500 dark:text-white'>
							<span className='font-semibold'>Note:</span> you can always
							explore other roles or add more roles to your account later.
						</p>
					</div>
					<button
						data-account-role='investor'
						onClick={handleButtonClick}
						className={`px-16 py-4 rounded text-white mb-4 w-[448px] ${
							loading
								? "bg-gray-500"
								: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
						}  `}
					>
						<span className='text-xl font-bold'>I&apos;m an Investor:</span>{" "}
						<br />I want to explore investment opportunities.
					</button>
					<button
						data-account-role='producer'
						onClick={handleButtonClick}
						className={`px-16 py-4 rounded text-white  mb-4 w-[448px] ${
							loading
								? "bg-gray-500"
								: "cursor-pointer bg-green-700 transition-all hover:scale-105 hover:bg-green-500"
						}  `}
					>
						<span className='text-xl font-bold'>I&apos;m a Producer:</span>{" "}
						<br />I want to showcase my projects for investment.
					</button>
				</div>
			);
	}
};

export default withAuth(Onboarding);
