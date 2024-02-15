import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import DOMPurify from "dompurify";
import axios from "axios";
type Props = {
	setVerified: (verified: boolean) => void;
	setShowMFA: (showMFA: boolean) => void;
	mfaEnabled: boolean;
};

function AuthMFA({ mfaEnabled, setVerified, setShowMFA }: Props) {
	const [verifyCode, setVerifyCode] = useState("");
	const [error, setError] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const user = useAppSelector((state: RootState) => state.user);

	const onSubmitClicked = () => {
		setLoading(true);
		setError("");
		const sanitizedCode = DOMPurify.sanitize(verifyCode);
		axios
			.post("/api/mfa/verify", { verifyCode: sanitizedCode, userId: user.id })
			.then((res) => {
				console.log("res.data >>> ", res.data);
				if (res.data.error) {
					setError(res.data.error);
					setLoading(false);
				}
				if (!res.data.error) {
					dispatch(
						setUser({
							...user,
							mfaVerified: true,
						})
					);
					setShowMFA(false);
					setVerified(true);
					setLoading(false);
				}
			});
	};
	useEffect(() => {
		const sanitizedCode = DOMPurify.sanitize(verifyCode);
		if (sanitizedCode.length === 6) {
			onSubmitClicked();
			setDisabled(false);
		}
		if (sanitizedCode.length > 6) {
			setVerifyCode(sanitizedCode.slice(0, 6));
		}
		if (sanitizedCode.length < 6) {
			setVerified(false);
			setDisabled(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verifyCode]);
	// Logout logic
	const dispatch = useAppDispatch();
	const router = useRouter();
	const handleLogoutClick = async () => {
		// Handle logout logic here

		axios
			.post("/api/logout", {
				options: {
					setMFAFalse: true,
				},
				userId: user.id,
			})
			.then((res) => {
				console.log("res.data >>> ", res.data);
				dispatch(
					setUser({
						roles: [""],
						loggedIn: false,
						id: "",
						producerId: "",
						investorId: "",
						activeRole: "",
						currentTheme: "dark",
						email: "",
						name: "",
						phoneNumber: "",
						isVerified: false,
						totalUserTreeCount: 0,
						userTreeCount: 0,
						onboardingComplete: false,
						investorOnboardingComplete: false,
						producerOnboardingComplete: false,
						emailNotification: false,
						smsNotification: false,
						pushNotification: false,
						mfaEnabled: false,
						mfaVerified: false,
						mfaVerifiedAt: "",
						mfaFrequency: "",
						loadingUser: true,
					})
				);
			})
			.catch((err) => {
				console.log("err >>> ", err);
			});

		setShowMFA(false);
		router.push("/login");
	};

	useEffect(() => {
		if (!mfaEnabled) router.push("/setup-mfa");
	}, [mfaEnabled, router]);

	return (
		<div className='flex flex-col'>
			<Image
				src='/white_logo_transparent_background.png'
				width={200}
				height={200}
				alt='EcoWealth Logo'
			/>
			<h1 className='text-2xl font-semibold mb-4 flex items-center'>
				<FaLock className='mr-2' /> Verify MFA-Security Code
			</h1>
			<p className='mb-2'>Please enter the code from your authenticator app.</p>
			{error && <div className='error text-red-600'>MFA-Error: {error}</div>}
			<input
				type='text'
				value={verifyCode}
				maxLength={6}
				onChange={(e) => setVerifyCode(e.target.value.trim())}
				className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
			/>
			<button
				value='Submit'
				onClick={onSubmitClicked}
				disabled={disabled}
				className={
					disabled && loading
						? "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						: !disabled && !loading
						? "bg-green-500 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						: "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				}
			>
				{loading ? "Verifying..." : "Confirm Code"}
			</button>
			<p
				onClick={handleLogoutClick}
				className='mt-4 text-center text-sm cursor-pointer text-gray-400 hover:text-[var(--cta-two-hover)] transition-colors'
			>
				Sign out
			</p>
		</div>
	);
}

export default AuthMFA;
