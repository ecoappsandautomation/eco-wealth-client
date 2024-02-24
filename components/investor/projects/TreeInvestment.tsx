import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import TreeInvestmentLeft from "./InvestmentLeft";
import ProceedToCheckoutButton from "@/components/investor/projects/ProceedToCheckoutButton";
import { GiPieChart } from "react-icons/gi";
import moment from "moment";
import Loading from "@/components/Loading";

type Props = {
	project: Project;
	sharesRemaining: number;
};

export default function TreeInvestment({ project, sharesRemaining }: Props) {
	const {
		title,
		description,
		imageUrls,
		treeProjects,
		projectFinancials,
		isNonProfit,
	} = project;
	const [numberOfShares, setNumberOfShares] = useState(1);
	const [amountPerShare, setAmountPerShare] = useState(
		projectFinancials.amountPerShare
	);
	const [checkoutStep, setCheckoutStep] = useState(1);
	useEffect(() => {
		if (!project) return;

		setAmountPerShare(projectFinancials.amountPerShare);
	}, [project, projectFinancials]);

	// Handle maximum number of shares available to be purchased
	useEffect(() => {
		if (!project) return;
		if (project && numberOfShares > sharesRemaining) {
			setNumberOfShares(sharesRemaining);
			toast.info(
				`Note: You can only invest in a maximum of ${sharesRemaining} shares for this project.`
			);
		}
	}, [numberOfShares, treeProjects, project, sharesRemaining]);

	const calculateROI = (returnPerShare: number) => {
		const amount = numberOfShares * returnPerShare;
		return amount.toFixed(2);
	};
	const merchantFeePercentage = 0.03;
	const merchantFeePercentageFinal = 1 + merchantFeePercentage;
	const transactionFee = 1;

	const calculateInvestmentSubtotalAmount = () => {
		const amount = numberOfShares * amountPerShare;
		return amount.toFixed(2);
	};

	const calculateInvestmentTotalAmount = () => {
		const amount =
			(numberOfShares * amountPerShare + transactionFee) *
			merchantFeePercentageFinal;
		return amount.toFixed(2).toLocaleString();
	};

	const calculateProcessingFees = () => {
		const amount =
			(numberOfShares * amountPerShare + transactionFee) *
			merchantFeePercentage;
		return amount.toFixed(2);
	};

	if (!project) {
		return <Loading />;
	}

	// Rest of the InvestmentPage component code
	const handleNumberOfSharesChange = (e: any) => {
		setNumberOfShares(e.target.value);
	};

	const estimatedMaturityDate = moment(treeProjects?.estMaturityDate).format(
		"MMMM Do, YYYY"
	); // 'July 15th, 2021

	switch (checkoutStep) {
		case 1:
			if (!treeProjects) return <Loading />;
			return (
				<div className='flex flex-col xl:flex-row mx-auto xl:w-[60%]'>
					<TreeInvestmentLeft
						title={title}
						description={description}
						imageUrl={imageUrls[0].url}
						isNonProfit={isNonProfit}
						treeProjectType={treeProjects.projectType}
						estPlantingDate={treeProjects.estPlantingDate.toString()}
						estimatedMaturityDate={estimatedMaturityDate}
					/>

					<form className='mt-4 md:mt-4 xl:px-8 flex-1'>
						<h2 className='text-xl font-semibold'>
							Choose how many{" "}
							{isNonProfit ? "trees to contribute" : "shares to acquire"}:
						</h2>
						<div className='flex flex-col my-4'>
							<label htmlFor='numberOfShares'>
								{isNonProfit ? "🌳" : ""} Number of{" "}
								{isNonProfit ? "trees" : "shares"}:
							</label>
							<div className='bg-white text-gray-500 p-[4px] rounded flex flex-nowrap items-center mt-[2px]'>
								<span className='text-lg text-green-600 ml-2'>
									<GiPieChart />
								</span>
								<input
									type='number'
									id='numberOfShares'
									value={numberOfShares}
									onChange={handleNumberOfSharesChange}
									min='1'
									// max={`${treeTarget}`}
									className='text-left w-full outline-none ml-2 text-2xl font-semibold'
								/>
							</div>
						</div>
						<div className='flex justify-between items-center my-2'>
							<label htmlFor='amountPerShare'>
								Amount per {isNonProfit ? "tree" : "share"}:
							</label>
							<p>
								$
								{Number(projectFinancials.amountPerShare).toLocaleString(
									"en-US"
								)}
							</p>
						</div>
						<div className='flex justify-between items-center text-green-500'>
							<span className='text-sm'>
								{treeProjects.projectType !== "Timber / Lumber" &&
									!isNonProfit && (
										<span className='text-xs'>(Pre-investment repayment)</span>
									)}
								<br />
								{treeProjects.projectType !== "Timber / Lumber"
									? "Potential Yearly Return ($)"
									: "Potential Return ($)"}
							</span>{" "}
							<span className='font-bold text-2xl '>
								$
								{Number(
									calculateROI(
										projectFinancials.estReturnPerShareUntilRepayment
									)
								).toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</span>
						</div>
						<div className='flex justify-between items-center text-green-500'>
							<span className='text-sm'>
								{treeProjects.projectType !== "Timber / Lumber"
									? "Potential Yearly ROI (%)"
									: "Potential ROI (%)"}
							</span>{" "}
							<span className='font-bold'>
								{projectFinancials.estRoiPercentagePerShareBeforeRepayment ||
									0.0}
								%
							</span>
						</div>
						{treeProjects.projectType !== "Timber / Lumber" && !isNonProfit && (
							<div>
								<div className='flex justify-between items-center text-green-500 mt-4'>
									<span className='text-sm'>
										<span className='text-xs'>(Post-investment repayment)</span>
										<br />
										Potential Yearly Return ($)
									</span>{" "}
									<span className='font-bold text-2xl '>
										$
										{Number(
											calculateROI(
												projectFinancials.estReturnPerShareAfterRepayment
											)
										).toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
								<div className='flex justify-between items-center text-green-500'>
									<span className='text-sm'>Potential Yearly ROI (%)</span>{" "}
									<span className='font-bold'>
										{projectFinancials.estRoiPercentagePerShareAfterRepayment}%
									</span>
								</div>
							</div>
						)}

						<hr className='mt-2' />
						{numberOfShares > 0 && (
							<>
								<div className='flex justify-between items-center mt-2'>
									<span className='text-sm'>
										{isNonProfit ? "Contribution" : "Investment"} Subtotal:{" "}
									</span>
									<span className='text-sm'>
										$
										{Number(calculateInvestmentSubtotalAmount()).toLocaleString(
											"en-US"
										)}
									</span>
								</div>
								<div className='my-2'>
									<span>Processing Fees </span>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Merchant Fee:</span>
										<span className='text-sm'>
											$
											{Number(calculateProcessingFees()).toLocaleString(
												"en-US"
											)}
										</span>
									</div>
									<div className='flex justify-between items-center'>
										<span className='text-sm'>Administrative Fee:</span>{" "}
										<span>$1.00</span>
									</div>
								</div>
								<hr className='my-2' />
								<div className='flex justify-between items-center'>
									<span>
										Total {isNonProfit ? "Contribution" : "Investment"} Today:{" "}
									</span>
									<span className='font-bold'>
										$
										{Number(calculateInvestmentTotalAmount()).toLocaleString(
											"en-US"
										)}
									</span>
								</div>
							</>
						)}
						<ProceedToCheckoutButton
							setCheckoutStep={setCheckoutStep}
							numOfShares={numberOfShares}
							projectId={project.id}
							project={project}
						/>
					</form>
				</div>
			);

		// TODO: bring payment step in-house
		// case 2:
		// 	return (
		// 		<div className='flex mx-auto lg:w-[60%]'>
		// 			<TreeInvestmentLeft
		// 				title={title}
		// 				description={description}
		// 				imageUrl={imageUrl}
		// 			/>
		// 			<TreeInvestmentCheckout
		// 				calculateInvestmentTotalAmount={parseFloat(
		// 					calculateInvestmentTotalAmount()
		// 				)}
		// 				handleInvestmentSuccess={handleInvestmentSuccess}
		// 				handleGoBack={handleGoBack}
		// 			/>
		// 		</div>
		// 	);
	}
}
