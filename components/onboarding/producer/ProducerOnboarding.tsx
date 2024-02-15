"use client";
import React, { use, useEffect, useState } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import InvestorOnboardingGoals from "./ProducerOnboardingGoals";

import LinearProgress from "@mui/material/LinearProgress";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

	// redundant id check to prevent no producer user profile from not being created
	const createProducerProfile = async () => {
		await axios
			.post("/api/producer/create", { userId: user.id })
			.then((res) => {
				console.log("Producer profile created: ", res.data);
			})
			.catch((err) => {
				console.log("Error creating producer profile: ", err);
			});
	};

	useEffect(() => {
		if (user.id && user.producerId === "" && user.roles.includes("producer")) {
			createProducerProfile();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const handleUpdateProducerOnboardingData = async () => {
		const address = {
			addressLineOne: onboarding.addressLineOne,
			addressLineTwo: onboarding.addressLineTwo,
			city: onboarding.city,
			stateProvince: onboarding.stateProvince,
			postalCode: onboarding.postalCode,
			country: onboarding.country,
		};
		const producerData = {
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
			address: address,
		};
		await axios
			.post("/api/onboard/producer", {
				producerData,
				userId: user.id,
				producerId: user.producerId,
			})
			.then((res) => {
				console.log("Producer onboarding complete: ", res.data);
				dispatch(setUser({ ...user, producerOnboardingComplete: true }));
				router.push("/p/dashboard");
			})
			.catch((err) => {
				console.log("Error creating producer onboarding data: ", err);
			});
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
