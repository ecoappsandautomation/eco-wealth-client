"use client";
import { BASE_URL } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { BsEye } from "react-icons/bs";
import { toast } from "react-toastify";

type Props = {};

export default function ReferralShareLink({}: Props) {
	const router = useRouter();
	const path: any = useParams();
	const { id } = path;
	const user = useAppSelector((state) => state.user);
	const referralId = user.referralId;
	const referralLink = `${BASE_URL}/pub/projects/${id}?r=${referralId}`;
	// Copy referral link to clipboard
	const copyToClipboard = (link: string) => {
		navigator.clipboard
			.writeText(link)
			.then(() => {
				// Display a success message or toast notification
				console.log("Referral link copied to clipboard!");
				toast.success("Referral link copied to clipboard!");
			})
			.catch((err) => {
				// Handle errors
				console.error("Failed to copy: ", err);
			});
	};
	return (
		<div>
			<div className='mt-4 border-[var(--cta-one)] border-2 p-3 rounded-md'>
				<p className='font-bold'>Referral Ambassador Links</p>
				<p className='text-sm text-gray-400'>
					Share your public referral link to this project:
				</p>
				<div className='flex'>
					<button
						onClick={() => copyToClipboard(referralLink)}
						className='mt-2 flex mr-2 text-sm md:text-base items-center bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						Copy public referral link
					</button>
				</div>
			</div>
			<div className='text-sm text-gray-400 flex items-center mt-1'>
				<BsEye className='mr-2' /> Only you can see this.
			</div>
		</div>
	);
}
