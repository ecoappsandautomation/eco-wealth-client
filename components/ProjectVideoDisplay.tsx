"use client";
import { useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiPlayCircle } from "react-icons/bi";
import ReactPlayer from "react-player/lazy";
type Props = {
	videos: string[];
};

export default function ProjectVideoDisplay({ videos }: Props) {
	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
	useEffect(() => {
		console.log("videos >>> ", videos);
		if (!videos) return;
		if (videos.length === 0) return;
		setSelectedVideo(videos[0]);
	}, [videos]);
	const matches = useMediaQuery("(max-width: 768px)");
	return (
		<div>
			<div className='flex flex-col md:flex-row mb-4'>
				{videos && videos.length > 0 && (
					<ReactPlayer
						url={selectedVideo || ""}
						controls={true}
						width={"100%"}
						height={matches ? "100%" : "240px"}
					/>
				)}
				{videos && videos.length > 1 && (
					<div className='mt-2 md:mt-0 md:ml-2 flex md:flex-col md:overflow-y-auto md:overflow-x-hidden overflow-x-auto'>
						{videos.map((video, index) => (
							<button
								key={index}
								onClick={() => setSelectedVideo(video)}
								className={
									selectedVideo === video
										? "flex items-center justify-center border-[1px] border-green-700  text-green-700 h-[48px] w-[48px] rounded-md mr-2 md:mb-2"
										: "flex items-center justify-center border-[1px] border-gray-500 h-[48px] w-[48px] rounded-md hover:bg-gray-200 transition-all mr-2 md:mb-2 cursor-pointer"
								}
							>
								<BiPlayCircle className='text-xl' />
							</button>
						))}
					</div>
				)}
			</div>
			{videos && videos.length > 0 && <hr className='my-4 border-gray-500' />}
		</div>
	);
}
