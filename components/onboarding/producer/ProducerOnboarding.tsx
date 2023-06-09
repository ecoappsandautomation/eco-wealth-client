"use client";
import React, { use, useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import InvestorOnboardingGoals from "./ProducerOnboardingGoals";

import LinearProgress from "@mui/material/LinearProgress";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ProducerOnboardingSubmit from "./ProducerOnboardingSubmit";
import ProducerOnboardingAddress from "./ProducerOnboardingAddress";
import ProducerOnboardingGoals from "./ProducerOnboardingGoals";
import ProducerOnboardingCurrentOps from "./ProducerOnboardingCurrentOps";
import ProducerOnboardingPropertyZone from "./ProducerOnboardingPropertyZone";

import shortid from "shortid";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";

export default function ProducerOnboarding() {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const onboarding = useAppSelector((state: RootState) => state.onboarding);

	const router = useRouter();

	const handleUpdateProducerOnboardingStatus = async (onboardingId: string) => {
		const { data, error } = await supabase
			.from("producers")
			.update({
				onboarding_complete: true,
				onboarding_id: onboardingId,
			})
			.eq("user_id", user.id);
		if (error) {
			console.error("Error updating producer onboarding status:", error);
			toast.error(
				`Error updating producer onboarding status: ${error.message}`
			);
			return;
		}
		if (data) {
		}
		dispatch(setUser({ ...user, producerOnboardingComplete: true }));
	};

	const handleUpdateProducerOnboardingData = async () => {
		const { data, error } = await supabase
			.from("producer_onboarding")
			.insert([
				{
					id: uuidv4(),
					producer_id: user.producerId,
					goals: onboarding.producerGoal,
					operation_type: onboarding.operationType,
					current_operations: {
						has_tree_farm_operation: onboarding.hasTreeFarmOperation,
						tree_types: onboarding.treeTypes,
						tree_op_size: onboarding.treeOpSize,
						has_solar_farm_operation: onboarding.hasSolarFarmOperation,
						solar_types: onboarding.solarTypes,
						solar_op_size: onboarding.solarOpSize,
					},
					property_zone_map: onboarding.propertyZoneMap,
				},
			])
			.select();
		if (error) {
			console.error("Error updating producer onboarding data:", error);
			toast.error(`Error updating producer onboarding data: ${error.message}`);
		}
		if (data) {
			handleUpdateProducerOnboardingStatus(data[0].id);
			const address = {
				addressLineOne: onboarding.addressLineOne,
				addressLineTwo: onboarding.addressLineTwo,
				city: onboarding.city,
				stateProvince: onboarding.stateProvince,
				postalCode: onboarding.postalCode,
				country: onboarding.country,
			};

			await axios
				.post(`${getBasePath()}/api/properties/create`, {
					producerId: user.producerId,
					address: address,
				})
				.then((res) => {
					console.log("Property created: ", res.data);
				})
				.catch((err) => {
					console.log("Error creating property: ", err);
				});
		}
	};

	// Here we manage the view of the onboarding steps
	const [step, setStep] = useState(1);
	const handleNextStep = () => {
		setStep(step + 1);
	};
	const handlePreviousStep = () => {
		setStep(step - 1);
	};

	const renderInvestorOnboardingContent = () => {
		switch (step) {
			case 1:
				return <ProducerOnboardingAddress handleNextStep={handleNextStep} />;
			case 2:
				return (
					<ProducerOnboardingGoals
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
					/>
				);
			case 3:
				return (
					<ProducerOnboardingCurrentOps
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
					/>
				);
			case 4:
				return (
					<ProducerOnboardingPropertyZone
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
					/>
				);
			case 5:
				return (
					<ProducerOnboardingSubmit
						handleUpdateProducerOnboardingData={
							handleUpdateProducerOnboardingData
						}
					/>
				);
		}
	};
	return (
		<div className='my-8'>
			<LinearProgress
				variant='determinate'
				color='success'
				value={(step - 1) * 25}
			/>
			<div className='flex justify-end'>
				{step !== 5 ? (
					<p className='text-xs font-light mt-[4px]'>Step {step} / 4</p>
				) : (
					<p className='text-xs font-light mt-[4px]'>Onboarding Complete</p>
				)}
			</div>
			<form>{renderInvestorOnboardingContent()}</form>
		</div>
	);
}
