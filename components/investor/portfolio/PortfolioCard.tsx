"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LinearProgress } from "@mui/material";
interface PortfolioCardProps {
	project: Project;
	totalShares?: number;
	totalAmountInvested?: number;
	totalAmountRaised?: number;
	amountRequested?: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
	project,
	totalShares,
	totalAmountInvested,
	totalAmountRaised,
	amountRequested,
}) => {
	const { imageUrls } = project;
	// console.log("project >>> ", project);
	const [bannerUrl, setBannerUrl] = useState("");
	useEffect(() => {
		// look through imageUrls and find the one with isBanner = true and run setBannerUrl to set it to that image
		if (!imageUrls) return;
		let bannerFound = false;
		imageUrls?.forEach((image) => {
			console.log("image", image);
			if (image.isBanner) {
				setBannerUrl(image.url);
				bannerFound = true;
			}
		});
		// If no banner is found, set the banner to the first image in the array
		if (!bannerFound && imageUrls.length > 0) {
			setBannerUrl(imageUrls[0].url);
		}
	}, [imageUrls]);
	if (!project) return <div>loading...</div>;
	// TODO: Refactor /api/investor/portfolio/route.tsx to return collectiveTotalAmountRaised
	let percentFunded = 0;
	if (amountRequested && totalAmountRaised) {
		percentFunded = (totalAmountRaised / amountRequested) * 100;
	}

	return (
		<div className='lg:w-[308px] w-[408px] bg-transparent rounded-2xl md:mr-2 shadow-md relative mt-8 z-10 h-fit pb-2'>
			<div>
				<Link href={`/i/portfolio/${project.id}`}>
					<Image
						src={bannerUrl}
						width={288}
						height={150}
						className='w-full h-48 object-cover rounded-2xl relative'
						alt={project.title}
					/>
					<div className='pt-[4px]'>
						<h3 className='text-xl '>{project.title}</h3>
						<div className='text-sm text-gray-400 flex'>
							{totalShares && (
								<p className='mb-[2px] mr-[4px]'>
									{totalShares} shares{totalAmountInvested && "  • "}
								</p>
							)}
							{totalAmountInvested && (
								<p className='mb-4'>
									${totalAmountInvested.toFixed(2)} invested
								</p>
							)}
							{totalAmountRaised && (
								<p className='mb-4'>
									Amount raised: ${totalAmountRaised.toFixed(2)}
								</p>
							)}
						</div>
						{/* <LinearProgress
							variant='determinate'
							value={percentFunded}
							/>
							<p className='mb-4 text-xs text-right mt-2'>
							{percentFunded.toFixed(2)}% Funded
						</p>*/}
					</div>
				</Link>
			</div>
		</div>
	);
};

export default PortfolioCard;
