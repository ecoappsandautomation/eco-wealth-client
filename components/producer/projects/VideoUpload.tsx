import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactPlayer from "react-player/lazy";
type Props = {
	register: any;
	index: number;
	removeVideoUrl: (index: number) => void;
};

export default function VideoUploadInput({
	index,
	removeVideoUrl,
	register,
}: Props) {
	return (
		<div className='w-full '>
			<input
				type='text'
				{...register(`videoUrls.${index}`)}
				className='text-gray-700 p-2 border-2 w-max border-gray-300 rounded-md'
				placeholder={`Video URL ${index + 1}`}
			/>
			<button
				type='button'
				onClick={() => removeVideoUrl(index)}
				className='mb-4 mt-2 text-left ml-2 w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] 
								text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
			>
				Remove
			</button>
		</div>
	);
}
