"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUnlock } from "react-icons/fa";
import { toast } from "react-toastify";
/**
 * UnenrollMFA shows a simple table with the list of factors together with a button to unenroll.
 * When a user types in the factorId of the factor that they wish to unenroll and clicks unenroll
 * the corresponding factor will be unenrolled.
 */
type Props = {
	onCancelled: () => void;
};

function UnenrollMFA({ onCancelled }: Props) {
	const [factorId, setFactorId] = useState("");
	const [factors, setFactors] = useState([]);
	const [error, setError] = useState(""); // holds an error message
	const user = useAppSelector((state: RootState) => state.user);
	useEffect(() => {
		(async () => {
			await axios
				.get("/api/mfa/list_factors")
				.then((res) => {
					console.log("res.data >>> ", res.data);
					setFactors(res.data.factors);
					setFactorId(res.data.factorId);
				})
				.catch((error) => {
					setError(error.message);
				});
		})();
	}, []);

	const handleCancel = async (id: string) => {
		await axios
			.post("/api/mfa/unenroll", {
				factorId: id,
				userId: user.id,
				factors,
			})
			.then((res) => {
				toast.success("MFA unenrolled successfully");
				onCancelled();
			})
			.catch((error) => {
				setError(error.message);
			});
	};
	return (
		<>
			{error && <div className='error'>{error}</div>}
			<div className='flex items-center border-green-900 rounded-md border-[1px] p-4'>
				<tbody className='pr-2 '>
					<tr className='flex justify-between'>
						<td className=''>Factor ID</td>
						<td className='px-2'>Factor Status</td>
					</tr>
					<hr />
					{factors.map((factor) => (
						<div key={(factor as any).id}>
							<tr key={(factor as any).id}>
								<td>{(factor as any).id}</td>
								<td className='pr-3'>{(factor as any).factor_type}</td>
								<td>{(factor as any).status}</td>
							</tr>
							<button
								key={(factor as any).id}
								className='flex items-center px-4 py-2 ml-4 rounded bg-red-900 text-white font-bold transition-all hover:bg-orange-900'
								onClick={() => handleCancel((factor as any).id)}
							>
								<FaUnlock className='text-xl' />
								Remove MFA
							</button>
						</div>
					))}
				</tbody>
			</div>
		</>
	);
}

export default UnenrollMFA;
