"use client";
import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";

interface Milestone {
	name: string;
	description: string;
	date: string;
	position: number;
	currentMilestone?: boolean;
}

interface Props {
	milestones: Milestone[];
}

const Roadmap: React.FC<Props> = ({ milestones }) => {
	// Find the index of the milestone with currentMilestone as true
	const defaultOpenMilestoneIndex = milestones.findIndex(
		(milestone) => milestone.currentMilestone
	);
	const [openMilestone, setOpenMilestone] = useState(
		defaultOpenMilestoneIndex >= 0 ? defaultOpenMilestoneIndex : null
	);

	const toggleMilestone = (index: number) => {
		setOpenMilestone((prev) => (prev === index ? null : index));
	};
	useEffect(() => {
		const handleOutsideClick = (event: any) => {
			const isClickInsideMilestone = event.target.closest(".milestone");
			if (!isClickInsideMilestone) {
				setOpenMilestone(null);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);
	const doesMilestoneClip = (milestoneLeft: any, showMilestoneRight: any) => {
		const viewportWidth = window.innerWidth;
		const milestoneDetailsWidth = 200; // Assuming milestone details width

		if (showMilestoneRight) {
			// Check if milestone details extend beyond the right edge of the viewport
			return milestoneLeft + milestoneDetailsWidth > viewportWidth;
		} else {
			// Check if milestone details extend beyond the left edge of the viewport
			return milestoneLeft - milestoneDetailsWidth < 0;
		}
	};

	// Render the milestone pins
	const renderMilestones = () => {
		return milestones.map((milestone, index) => {
			const milestoneLeft = milestone.position;
			const isMilestoneOpen = openMilestone === index;
			const showMilestoneRight = milestoneLeft > 50;
			let milestoneDetailsStyle = {
				top: "32px",
				[showMilestoneRight ? "right" : "left"]: `calc(50% + ${
					showMilestoneRight ? "-8px" : "8px"
				})`,
				transform: `translateX(${showMilestoneRight ? "-0%" : "0"})`,
			};

			// Check if milestone clips
			const isMilestoneClipped = doesMilestoneClip(
				milestoneLeft,
				showMilestoneRight
			);

			// Check if it's not the last milestone
			if (index !== milestones.length - 1) {
				const nextMilestoneLeft = milestones[index + 1].position;
				const showNextMilestoneRight = nextMilestoneLeft > 50;

				// If the next milestone is positioned to the right, adjust the details to the left
				if (showNextMilestoneRight) {
					milestoneDetailsStyle = {
						top: "32px",
						right: "calc(200% + 8px)", // Adjusted right positioning
						transform: "translateX(100%)", // Translate details to the left
					};
				}
			}

			return (
				<div
					key={index}
					className={`relative flex items-center justify-center milestone ${
						isMilestoneOpen ? "milestone-open" : ""
					} ${isMilestoneClipped ? "milestone-clipped" : ""}`}
					style={{ left: `${milestoneLeft}%` }}
					onMouseEnter={() => toggleMilestone(index)}
				>
					<div>
						{milestone.currentMilestone && (
							<div className='flex  mt-[-24px] mb-[4px] items-center ml-[-2px] pulsate'>
								<IoLocationSharp className='text-3xl text-green-600' />
								<p className='text-[12px]'>We are here</p>
							</div>
						)}
						<div
							className={`w-6 h-6 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] rounded-full flex items-center justify-center text-white transition-transform transform-gpu hover:scale-110`}
						></div>
					</div>
					{isMilestoneOpen && (
						<div
							className={`absolute bg-gradient-to-r from-[#000308] to-[#0C2100] p-3 rounded-lg shadow-md shadow-green-400 z-10 w-[200px] `}
							style={milestoneDetailsStyle}
						>
							<p className='text-sm font-bold text-green-400'>
								{milestone.name}
							</p>
							<p className='text-sm font-bold text-gray-300 mb-2'>
								({milestone.date})
							</p>
							<p className='text-xs text-gray-400'>{milestone.description}</p>
						</div>
					)}
				</div>
			);
		});
	};

	return (
		<div className='relative h-12 overflow-x-hidden pb-[400px]'>
			{/* Render the road */}
			<svg
				viewBox='0 0 1000 20'
				preserveAspectRatio='none'
				className='absolute left-0 top-1/2 w-full'
			>
				<path
					d='M0 10 C250 10, 250 0, 500 0 S750 10, 1000 10'
					fill='none'
					stroke='#888'
					strokeWidth='4'
				/>
			</svg>
			{/* Render the milestones */}
			<div className='absolute left-0 top-0 h-full flex items-center'>
				{renderMilestones()}
			</div>
		</div>
	);
};

export default Roadmap;
