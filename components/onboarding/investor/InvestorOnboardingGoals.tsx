import React, { useEffect, useState } from "react";
import SkipOnboardingButton from "./SkipOnboardingButton";

type Props = {
	investmentGoals: string[];
	handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	otherInvestmentGoal: string;
	investmentSectors: string[];
	setOtherInvestmentGoal: React.Dispatch<React.SetStateAction<string>>;
	handleSectorCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	preferredEnergyTypes: string[];
	handleEnergyTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	preferredTreeTypes: string[];
	handleTreeTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleNextStep: () => void;
	handleSkipOnboarding: (e: React.MouseEvent) => void;
};

export default function InvestorOnboardingGoals({
	investmentGoals,
	handleCheckboxChange,
	otherInvestmentGoal,
	investmentSectors,
	setOtherInvestmentGoal,
	handleSectorCheckboxChange,
	preferredEnergyTypes,
	handleEnergyTypeChange,
	preferredTreeTypes,
	handleTreeTypeChange,
	handleNextStep,
	handleSkipOnboarding,
}: Props) {
	const [disableNextStep, setDisableNextStep] = useState(true);
	useEffect(() => {
		if (investmentGoals.length === 0 || investmentSectors.length === 0) {
			setDisableNextStep(true);
		} else {
			setDisableNextStep(false);
		}
	}, [investmentGoals, investmentSectors]);

	return (
		<>
			{/* Investor's Primary Goal */}
			<fieldset className='flex flex-col'>
				<legend className='text-xl font-light mb-2'>
					What is your primary investment goal?
				</legend>
				<label
					htmlFor='goal1'
					className='flex items-center m-3'
				>
					<input
						id='goal1'
						type='checkbox'
						value='Short-term profit'
						checked={investmentGoals.includes("Short-term profit")}
						onChange={handleCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Short-term profit
				</label>
				<label
					htmlFor='goal2 '
					className='flex items-center m-3'
				>
					<input
						id='goal2'
						type='checkbox'
						value='Long-term profit'
						checked={investmentGoals.includes("Long-term profit")}
						onChange={handleCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Long-term profit
				</label>
				<label
					htmlFor='goal3 '
					className='flex items-center m-3'
				>
					<input
						id='goal3'
						type='checkbox'
						value='Diversify portfolio'
						checked={investmentGoals.includes("Diversify portfolio")}
						onChange={handleCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Diversify portfolio
				</label>
				<label
					htmlFor='other '
					className='flex items-center m-3'
				>
					<input
						id='other'
						type='checkbox'
						value='other'
						checked={investmentGoals.includes("other")}
						onChange={handleCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Other
					{investmentGoals.includes("other") && (
						<input
							type='text'
							className='ml-2 rounded-md w-[500px] text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
							value={otherInvestmentGoal}
							onChange={(e) => setOtherInvestmentGoal(e.target.value)}
						/>
					)}
				</label>
			</fieldset>
			{/* Investor's Desired Sectors */}
			<fieldset className='flex flex-col mt-8'>
				<legend className='text-xl font-light mb-2'>
					Which sector interests you more for investment?
				</legend>
				<label
					htmlFor='sector1'
					className='flex items-center m-3'
				>
					<input
						id='sector1'
						type='checkbox'
						value='Trees'
						checked={investmentSectors.includes("Trees")}
						onChange={handleSectorCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Trees
				</label>
				<label
					htmlFor='sector2'
					className='flex items-center m-3'
				>
					<input
						id='sector2'
						type='checkbox'
						value='Renewable Energy'
						checked={investmentSectors.includes("Renewable Energy")}
						onChange={handleSectorCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Renewable Energy
				</label>
				<label
					htmlFor='sector3'
					className='flex items-center m-3'
				>
					<input
						id='sector3'
						type='checkbox'
						value='Both'
						checked={investmentSectors.includes("Both")}
						onChange={handleSectorCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Both
				</label>
			</fieldset>
			{/* Tree Investment Preferences */}
			{investmentSectors.includes("Trees") ? (
				<fieldset className='flex flex-col mt-8'>
					<legend className='text-xl font-light mb-2'>
						What type(s) of trees do you prefer investing into?
					</legend>
					<label
						htmlFor='treeType1'
						className='flex items-center m-3'
					>
						<input
							id='treeType1'
							type='checkbox'
							name='treeType'
							value='Timber / Lumber'
							checked={preferredTreeTypes.includes("Timber / Lumber")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Timber / Lumber
					</label>
					<label
						htmlFor='treeType2'
						className='flex items-center m-3'
					>
						<input
							id='treeType2'
							type='checkbox'
							name='treeType'
							value='Fruit'
							checked={preferredTreeTypes.includes("Fruit")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Fruit
					</label>
					<label
						htmlFor='treeType3'
						className='flex items-center m-3'
					>
						<input
							id='treeType3'
							type='checkbox'
							name='treeType'
							value='Nut'
							checked={preferredTreeTypes.includes("Nut")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Nut
					</label>
					<label
						htmlFor='treeType4'
						className='flex items-center m-3'
					>
						<input
							id='treeType4'
							type='checkbox'
							name='treeType'
							value='Bio Fuel'
							checked={preferredTreeTypes.includes("Bio Fuel")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Bio Fuel
					</label>
					<label
						htmlFor='treeType5'
						className='flex items-center m-3'
					>
						<input
							id='treeType5'
							type='checkbox'
							name='treeType'
							value='Pulp'
							checked={preferredTreeTypes.includes("Pulp")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Pulp
					</label>
					<label
						htmlFor='treeType6'
						className='flex items-center m-3'
					>
						<input
							id='treeType6'
							type='checkbox'
							name='treeType'
							value='Syrup'
							checked={preferredTreeTypes.includes("Syrup")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Syrup
					</label>
					<label
						htmlFor='treeType7'
						className='flex items-center m-3'
					>
						<input
							id='treeType7'
							type='checkbox'
							name='treeType'
							value='Oil / Chemical'
							checked={preferredTreeTypes.includes("Oil / Chemical")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Oil / Chemical
					</label>
					<label
						htmlFor='treeType8'
						className='flex items-center m-3'
					>
						<input
							id='treeType8'
							type='checkbox'
							name='treeType'
							value='No Preference'
							checked={preferredTreeTypes.includes("No Preference")}
							onChange={handleTreeTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						No Preference
					</label>
				</fieldset>
			) : null}

			{/* Investor Renewable Energy Preference */}
			{investmentSectors.includes("Renewable Energy") ? (
				<fieldset className='flex flex-col mt-8'>
					<legend className='text-xl font-light mb-2'>
						What type(s) of renewable energy do you prefer investing in?
					</legend>
					<label
						htmlFor='energyType1'
						className='flex items-center m-3'
					>
						<input
							id='energyType1'
							type='checkbox'
							name='energyType'
							value='Solar'
							checked={preferredEnergyTypes.includes("Solar")}
							onChange={handleEnergyTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Solar
					</label>
					<label
						htmlFor='energyType2'
						className='flex items-center m-3'
					>
						<input
							id='energyType2'
							type='checkbox'
							name='energyType'
							value='Wind'
							checked={preferredEnergyTypes.includes("Wind")}
							onChange={handleEnergyTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Wind
					</label>
					<label
						htmlFor='energyType3'
						className='flex items-center m-3'
					>
						<input
							id='energyType3'
							type='checkbox'
							name='energyType'
							value='Hydroelectric'
							checked={preferredEnergyTypes.includes("Hydroelectric")}
							onChange={handleEnergyTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Hydroelectric
					</label>
					<label
						htmlFor='energyType4'
						className='flex items-center m-3'
					>
						<input
							id='energyType4'
							type='checkbox'
							name='energyType'
							value='Geothermal'
							checked={preferredEnergyTypes.includes("Geothermal")}
							onChange={handleEnergyTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Geothermal
					</label>
					<label
						htmlFor='energyType5'
						className='flex items-center m-3'
					>
						<input
							id='energyType5'
							type='checkbox'
							name='energyType'
							value='No Preference'
							checked={preferredEnergyTypes.includes("No Preference")}
							onChange={handleEnergyTypeChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						No Preference
					</label>
				</fieldset>
			) : null}

			<div className='flex justify-end'>
				<SkipOnboardingButton handleSkipOnboarding={handleSkipOnboarding} />
				<button
					type='button'
					onClick={handleNextStep}
					className={
						disableNextStep
							? "w-[33%] bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-default"
							: "w-[33%] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					}
					disabled={disableNextStep}
				>
					Continue
				</button>
			</div>
		</>
	);
}
