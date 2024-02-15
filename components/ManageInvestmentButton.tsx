import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { BiBuilding } from "react-icons/bi";
import { FaHammer } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
const moment = require("moment");

type Props = { investment: any };

export default function ManageInvestmentButton({ investment }: Props) {
	const [showPopup, setShowPopup] = useState(false);
	const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
	const [currentAction, setCurrentAction] = useState<string>("");
	const [processingRefund, setProcessingRefund] = useState<boolean>(false);
	const [refundError, setRefundError] = useState<boolean>(false);
	const [refundDeadline, setRefundDeadline] = useState<string>("");
	const handleManageClick = (investment: any) => {
		setSelectedInvestment(investment);
		setShowPopup(true);
		setCurrentAction("");
	};
	const handleAction = (action: string) => {
		setCurrentAction(action);
	};

	const handleRefund = () => {
		console.log("processing refund...");
		setProcessingRefund(true);
		setRefundError(false);
		axios
			.post("/api/investor/portfolio/project/refund", {
				investmentId: selectedInvestment.id,
			})
			.then((res) => {
				if (res.data) {
					alert("Refund processed!");
					setProcessingRefund(false);
				}
			})
			.catch((err) => {
				setProcessingRefund(false);
				setRefundError(true);
				console.log("error processing refund >>> ", err);
			});
	};
	function add28Days(dateString: string) {
		// Parse the input string as a moment date
		const date = moment(dateString);

		// Check if the date is valid
		if (!date.isValid()) {
			return "Invalid date";
		}

		// Add 28 days
		date.add(28, "days");

		// Format the date back to a string (YYYY-MM-DD)
		return date.format("dddd MMM DD YYYY");
	}
	const ManageInvestment = () => {
		if (!selectedInvestment) return null;
		console.log(
			"selectedInvestment.createdAt >>> ",
			selectedInvestment.createdAt
		);
		const ActionContent = () => {
			switch (currentAction) {
				case "refund":
					return (
						<>
							{refundError ? (
								<p>
									Error processing refund! Please reach out to{" "}
									<a
										href='mailto:support@ecowealth.app'
										className='text-[var(--cta-one)] hover:text-[var(--cta-two-hover)] transition-all'
									>
										our support team
									</a>{" "}
									to assist you with processing this refund.
								</p>
							) : (
								<p>
									You have until {add28Days(selectedInvestment.createdAt)} to
									refund this investment until <br />
									it is locked in until the project matures.
								</p>
							)}
							<div className='space-x-2 mt-4 flex justify-end'>
								<button
									onClick={() => handleRefund()}
									className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors'
									disabled={processingRefund}
								>
									{processingRefund ? (
										<CircularProgress
											sx={{
												width: "16px !important",
												height: "16px !important",
											}}
											color='success'
										/>
									) : (
										"Refund"
									)}
								</button>
								<button
									onClick={() => setCurrentAction("")}
									className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors'
								>
									Cancel
								</button>
							</div>
						</>
					);
				case "under-development":
					return (
						<>
							<div className='flex flex-col my-4 justify-center items-center'>
								<FaHammer
									size={72}
									className='mb-2'
								/>
								<p>This feature is currently being developed.</p>
							</div>
							<div className='space-x-2 mt-4 flex justify-end'>
								<button
									onClick={() => setCurrentAction("")}
									className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors'
								>
									Go back
								</button>
							</div>
						</>
					);
				default:
					return (
						<div className='space-x-2 mt-4'>
							<button
								onClick={() => handleAction("under-development")}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white px-4 py-2 rounded'
							>
								View Upcoming Payouts
							</button>
							<button
								onClick={() => handleAction("under-development")}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white px-4 py-2 rounded'
							>
								Sell
							</button>
							<button
								onClick={() => handleAction("under-development")}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white px-4 py-2 rounded'
							>
								Transfer
							</button>
							<button
								onClick={() => handleAction("refund")}
								className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white px-4 py-2 rounded'
							>
								Refund
							</button>
						</div>
					);
			}
		};
		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
				<div className='bg-green-950 p-4 rounded-lg text-left'>
					<div className='flex justify-end'>
						<button
							onClick={() => setShowPopup(false)}
							className=' text-gray-500 hover:text-red-400 hover:text-opacity-50 transition-colors'
						>
							<IoCloseCircle size={24} />
						</button>
					</div>
					<h3 className='text-xl font-bold mb-4'>Manage Investment</h3>
					<p>Investment Amount: ${selectedInvestment.amount}</p>
					<ActionContent />
				</div>
			</div>
		);
	};
	return (
		<>
			<button
				onClick={() => handleManageClick(investment)}
				className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors py-2 px-4 rounded text-white'
			>
				Manage
			</button>
			{showPopup && <ManageInvestment />}
		</>
	);
}
