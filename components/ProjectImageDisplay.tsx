"use client";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiCamera } from "react-icons/bi";

type Props = {
	bannerImage?: string | null;
	images?: ImageUrls;
};

export default function ProjectImageDisplay({ bannerImage, images }: Props) {
	const matches = useMediaQuery("(min-width: 768px)");
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	useEffect(() => {
		if (bannerImage) {
			setSelectedImage(bannerImage);
		} else {
			if (images && images.length > 0) {
				setSelectedImage(images[0].url);
			}
		}
	}, [bannerImage, images]);

	const handleSetImage = (url: string, e: any) => {
		e.preventDefault();
		setSelectedImage(url);
	};
	const [showAllImages, setShowAllImages] = useState(false);
	return (
		<div>
			{matches ? (
				<Image
					className='w-full h-64 object-cover object-center rounded-xl'
					src={
						selectedImage
							? selectedImage
							: "https://via.placeholder.com/1500x500"
					}
					alt='Banner'
					width={1500}
					height={500}
				/>
			) : (
				<Image
					src={
						selectedImage
							? selectedImage
							: "https://via.placeholder.com/1500x500"
					}
					alt='Banner'
					width={288}
					height={150}
					className='w-full h-48 object-cover rounded-2xl relative'
				/>
			)}
			{images && images.length > 1 && (
				<button
					onClick={() => setShowAllImages(!showAllImages)}
					className='my-2 flex items-center text-xs cursor-pointer border-[1px] border-gray-500 p-1 w-max rounded-md
                    hover:text-[var(--cta-one)] hover:border-[var(--cta-one)] transition-all'
				>
					<BiCamera className='mr-[2px] text-base' />{" "}
					{showAllImages ? "Hide images" : `+${images.length - 1} • show all`}
				</button>
			)}
			{images && images.length > 0 && showAllImages && (
				<div className='flex overflow-x-auto'>
					{images.map((image, index) => (
						<div
							key={index}
							className='relative mr-2'
						>
							<Image
								src={image.url}
								alt=''
								width={150}
								height={100}
								className={
									image.url === selectedImage
										? "rounded-md h-[100px] w-[150px] object-cover border-[1px] border-gray-700"
										: "rounded-md h-[100px] w-[150px] object-cover opacity-50 cursor-pointer hover:opacity-100 transition-all"
								}
								onClick={(e) => handleSetImage(image.url, e)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
