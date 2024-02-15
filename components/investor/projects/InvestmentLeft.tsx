import { useMediaQuery } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React from "react";

type Props = {
	imageUrl: string;
	title: string;
	description: string;
	estPlantingDate?: string;
	estimatedMaturityDate?: string;
	estInstallationDate?: string;
	treeProjectType?: string;
	projectLocationType?: string;
	energyProjectType?: string;
	isNonProfit?: boolean;
};

export default function InvestmentLeft({
	imageUrl,
	title,
	description,
	estPlantingDate,
	estimatedMaturityDate,
	treeProjectType,
	projectLocationType,
	energyProjectType,
	estInstallationDate,
	isNonProfit,
}: Props) {
	const matches = useMediaQuery("(max-width: 768px)");
	return (
		<div>
			<span className='flex justify-center mb-2'>
				{!matches ? (
					<Image
						width={600}
						height={150}
						src={imageUrl}
						alt={title}
						className='rounded-xl'
					/>
				) : (
					<Image
						width={288}
						height={150}
						src={imageUrl}
						alt={title}
						className='w-full h-48 object-cover rounded-2xl relative'
					/>
				)}
			</span>
			<h1 className='text-3xl font-light'>{title}</h1>
			<p className='text-lg font-light mb-2'>{description}</p>
			<p className='text-sm font-light mb-4'>
				{isNonProfit && `💚 Non-Profit • `}
				{treeProjectType && treeProjectType}
				{projectLocationType && projectLocationType}{" "}
				{energyProjectType && energyProjectType} project
			</p>
			{estPlantingDate && (
				<div className='border-[1px] rounded-sm px-[8px] py-[4px] w-[max-content] mb-[8px]'>
					<p className='text-sm font-semibold'>
						🌱 Estimated planting date:{" "}
						{moment(estPlantingDate).format("MMMM Do, YYYY")}
					</p>
				</div>
			)}
			{estimatedMaturityDate && (
				<div className='border-[1px] rounded-sm px-[8px] py-[4px] w-[max-content]'>
					<p className='text-sm font-semibold'>
						🌳 Estimated maturity date: {estimatedMaturityDate}
					</p>
				</div>
			)}
			{estInstallationDate && (
				<div className='border-[1px] rounded-sm px-[8px] py-[4px] w-[max-content]'>
					<p className='text-sm font-semibold'>
						🛠️ Estimated installation date: {estInstallationDate}
					</p>
				</div>
			)}
		</div>
	);
}
