"use client";
import { useState } from "react";
import axios from "axios";

const MFAFrequencySelector = ({
	currentFrequency,
	userId,
}: {
	currentFrequency: string;
	userId: string;
}) => {
	const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency);
	const [isButtonEnabled, setIsButtonEnabled] = useState(false);
	const handleFrequencyChange = async () => {
		try {
			await axios.post("/api/update_mfa_frequency", {
				userId,
				mfa_frequency: selectedFrequency,
			});
			console.log(`MFA frequency updated to: ${selectedFrequency}`);
			setIsButtonEnabled(false); // Disable the button after the frequency is updated
		} catch (error: any) {
			console.error("Error updating MFA frequency:", error.message);
		}
	};
	const handleFrequencySelection = (e: { target: { value: any } }) => {
		const newFrequency = e.target.value;
		console.log("New frequency selected: ", newFrequency);
		console.log("Current frequency: ", currentFrequency);
		if (newFrequency === currentFrequency) {
			console.log("New frequency is the same as the current frequency");
			return setIsButtonEnabled(false);
		}
		setSelectedFrequency(newFrequency);
		setIsButtonEnabled(true); // Enable the button when a new frequency is selected
	};
	return (
		<div className='mt-4'>
			<label htmlFor='mfaFrequency'>Select MFA Frequency:</label>
			<select
				id='mfaFrequency'
				name='mfaFrequency'
				value={selectedFrequency}
				onChange={handleFrequencySelection}
				className='border border-gray-300 rounded-md p-2 m-2 text-gray-500'
			>
				<option value='Always'>Always</option>
				<option value='7 Days'>Every 7 Days</option>
				<option value='14 Days'>Every 14 Days</option>
				<option value='28 Days'>Every 28 Days</option>
			</select>
			<button
				className={`py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
					isButtonEnabled
						? "bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-bold"
						: "bg-gray-500 cursor-default"
				}`}
				onClick={handleFrequencyChange}
				disabled={!isButtonEnabled}
			>
				Update MFA Frequency
			</button>
		</div>
	);
};

export default MFAFrequencySelector;
