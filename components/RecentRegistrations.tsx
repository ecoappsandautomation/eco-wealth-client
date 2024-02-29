import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaFileSignature } from "react-icons/fa";
import FullNameToFirstNameSplit from "@/utils/FullNameToFirstNameSplit";

export default function RecentRegistrations() {
	const [registrations, setRegistrations] = useState<any>([]);
	useEffect(() => {
		const fetchRegistrations = async () =>
			axios.get("/api/recent_waiting_list_signups").then((res) => {
				setRegistrations(res.data);
			}); // 1 second delay between each toast});

		fetchRegistrations();
	}, []);

	useEffect(() => {
		async function DisplayPopup(index: number, name: string, toastId: string) {
			setTimeout(async () => {
				toast.success(
					() => (
						<div className='flex items-center'>
							<FaFileSignature className='mr-[8px] text-[#07bc0c] text-xl' />{" "}
							<div>
								{FullNameToFirstNameSplit(name)} registered{" "}
								{moment(registrations[index].created_at).fromNow()}{" "}
								<span className='text-[#07bc0c] flex items-center font-bold text-xs'>
									<BsCheckCircleFill className='mr-[2px]' /> Verifed Email
								</span>
							</div>
						</div>
					),
					{
						position: "bottom-left",
						theme: "dark",
						icon: false,
					}
				);
			}, index * 5000);
		}
		for (let i = 0; i < registrations.length; i++) {
			const toastId = `registration-${registrations[i].id}`; // Assuming each registration has a unique 'id'

			DisplayPopup(i, registrations[i].name, toastId);
		}
	}, [registrations]);

	return <></>;
}
