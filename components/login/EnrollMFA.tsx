"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import copyToClipboard from "@/utils/copyToClipboard";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

/**
 * EnrollMFA shows a simple enrollment dialog. When shown on screen it calls
 * the `enroll` API. Each time a user clicks the Enable button it calls the
 * `challenge` and `verify` APIs to check if the code provided by the user is
 * valid.
 * When enrollment is successful, it calls `onEnrolled`. When the user clicks
 * Cancel the `onCancelled` callback is called.
 */
function EnrollMFA({
	onEnrolled,
	onCancelled,
	enableLogout,
	redirectTo,
}: {
	onEnrolled: () => void;
	onCancelled: () => void;
	enableLogout?: boolean;
	redirectTo?: string;
}) {
	const [factorId, setFactorId] = useState("");
	const [qr, setQR] = useState(""); // holds the QR code image SVG
	const [verifyCode, setVerifyCode] = useState(""); // contains the code entered by the user
	const [error, setError] = useState(""); // holds an error message
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [verified, setVerified] = useState(false);
	const user = useAppSelector((state: RootState) => state.user);
	const router = useRouter();
	const path = usePathname();

	const onEnableClicked = async () => {
		setLoading(true);
		setError("");
		await axios
			.post("/api/mfa/enroll/challenge", {
				verifyCode,
				factorId,
				userId: user.id,
			})
			.then((res) => {
				setVerified(true);
				onEnrolled();
				if (redirectTo) router.push(redirectTo);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	};

	useEffect(() => {
		console.log("setup mfa user >>> ", user);
		if (user.mfaEnabled && path === "/setup-mfa") {
			if (user.activeRole === "investor") {
				return router.push("/i/dashboard");
			}
			if (user.activeRole === "producer") {
				return router.push("/i/dashboard");
			}
		}
		(async () => {
			await axios
				.post("/api/mfa/enroll", { userId: user.id })
				.then((res) => {
					setFactorId(res.data.factorId);
					setQR(res.data.qr);
				})
				.catch((error) => {
					setError(error.message);
				});
		})();
	}, []);

	useEffect(() => {
		if (verifyCode.length === 6) {
			onEnableClicked();
			setDisabled(false);
		}
		if (verifyCode.length > 6) {
			setVerifyCode(verifyCode.slice(0, 6));
		}
		if (verifyCode.length < 6) {
			setVerified(false);
			setDisabled(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [verifyCode]);
	return (
		<>
			{error && <div className='error'>{error}</div>}
			<div className='border-[1px] border-white rounded-md p-4 flex flex-col'>
				<div className='bg-white w-[60%] h-[60%] mx-auto mb-4'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={qr}
						alt=''
						className='w-[100%] h-max'
					/>
				</div>

				<p className='text-center mb-2'>
					Scan the QR code above with an authenticator app and <br />
					enter the corresponding code that appears in the auth app below.
				</p>

				<input
					type='text'
					className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
					value={verifyCode}
					maxLength={6}
					onChange={(e) => setVerifyCode(e.target.value.trim())}
				/>

				<div
					className={enableLogout ? "flex justify-around" : "flex justify-end"}
				>
					{enableLogout && (
						<button
							className='flex items-center px-4 py-2  rounded bg-red-900 text-white font-bold transition-all hover:bg-orange-900'
							onClick={onCancelled}
						>
							Logout & Cancel Setup
						</button>
					)}
					<button
						className={
							disabled && loading
								? "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								: !disabled && !loading
								? "bg-green-500 hover:bg-green-700 transition-colors text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								: "bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						}
						onClick={onEnableClicked}
					>
						{loading ? "Activating..." : "Activate MFA Now"}
					</button>
				</div>
				<div className='text-center mt-4 text-gray-300'>
					<p className='text-sm'>
						Or you can copy this token into your authententicator app:
					</p>
					<div className='flex items-center'>
						<p
							onClick={() => copyToClipboard(factorId)}
							className='cursor-pointer mr-2 border-gray-400 border-2 p-2 rounded-md w-[max-content] hover:text-[var(--cta-one)] transition-colors'
						>
							{factorId}
						</p>
						<button
							onClick={() => copyToClipboard(factorId)}
							className='flex mr-2 text-sm md:text-base items-center border-2 border-[var(--cta-one)] hover:border-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded-md transition-colors cursor-pointer'
						>
							Copy token
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default EnrollMFA;
