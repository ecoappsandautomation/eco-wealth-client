import supabase from "@/utils/supabaseSuperClient";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";
type Props = {
	onUpload: (files: any) => void;
	userId: string;
	projectId: string;
	register: any;
	removeImageUrl: (index: number) => void;
	images: ImageUrls;
	setImages: (images: ImageUrls) => void;
};
const uploadProjectImage = async (filePath: any, file: File) => {
	const { data, error } = await supabase.storage
		.from("projects")
		.upload(filePath, file);
	if (error) {
		console.log("Error uploading file: ", error);
		throw error;
	}
	console.log("File uploaded successfully: ", data, "File name: ", file.name);

	return data;
};

const ImageUpload = ({
	onUpload,
	userId,
	projectId,
	removeImageUrl,
	register,
	images,
	setImages,
}: Props) => {
	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			console.log("acceptedFiles >>> ", acceptedFiles);
			console.log("userId >>> ", userId);
			console.log("projectId >>> ", projectId);
			// Array to store promises for each upload operation
			const uploadPromises = acceptedFiles.map((file) => {
				const filePath = `/${userId}/${projectId}/${file.name}`;
				return uploadProjectImage(filePath, file);
			});

			try {
				// Wait for all upload promises to resolve
				await Promise.all(uploadPromises);
				console.log("All images uploaded successfully");

				// Call onUpload after all images have been uploaded
			} catch (error) {
				console.error("Error uploading images: ", error);
				toast.error("Failed to upload images");
			} finally {
				onUpload(acceptedFiles);
			}
		},
		[onUpload, userId, projectId]
	);

	const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
		useDropzone({
			onDrop,
			accept: {
				"image/jpeg": [".jpeg", ".jpg"],
				"image/png": [".png"],
			},
			maxFiles: 10,
		});

	const deleteImage = (index: number, e: React.MouseEvent) => {
		e.preventDefault();
		const fileToDelete = images[index];
		const filePath = images[index].url.split("projects//")[1];

		// Remove the file from acceptedFiles array
		const updatedFiles = [...images];
		updatedFiles.splice(index, 1);

		console.log("filePath >>> ", filePath);
		// Delete the file from supabase.storage
		supabase.storage
			.from("projects")
			.remove([filePath])
			.then((response) => {
				console.log("delete image response >>> ", response);
				if (response.data && response.data.length > 0) {
					toast.success(`File deleted successfully`);
					setImages(updatedFiles);
				} else {
					console.log("Error deleting file: ", response.error);
					toast.error("Failed to delete file");
				}
			})
			.catch((error) => {
				console.error("Error deleting file: ", error);
				toast.error("Failed to delete file");
			});
	};

	// Create a function that sets the current banner to false, and the selected image's isBanner to true with setImages function
	const setBanner = (index: number, e: React.MouseEvent) => {
		e.preventDefault();
		const updatedImages = images.map((image, i) => {
			if (i !== index && image.isBanner) {
				return { ...image, isBanner: false };
			}
			if (i === index) {
				return { ...image, isBanner: true };
			} else {
				return { ...image, isBanner: false };
			}
		});

		setImages(updatedImages);
	};

	return (
		<div>
			{images && images.length > 0 && (
				<div>
					<h4 className='text-lg font-semibold mb-4'>Uploaded Files</h4>
					<div className='flex mb-4 overflow-x-auto'>
						{images.map(({ url, isBanner }, index) => (
							<div
								key={index}
								className=''
							>
								<div
									className={
										isBanner
											? "rounded-md mr-4 border-green-700 border-[2px] w-[max-content] bg-green-700"
											: "rounded-md mr-4 w-[max-content]"
									}
								>
									<button
										onClick={(e) => deleteImage(index, e)}
										className='absolute m-1 p-1 rounded-full bg-red-700 border-[1px] text-white hover:bg-red-500 hover:border-red-500 transition-all'
										title='Delete Image'
									>
										<BiTrash />
									</button>
									<Image
										alt=''
										src={url}
										height={100}
										width={150}
										className='rounded-md h-[100px] w-[150px] object-cover'
									/>
									{isBanner && <p className='text-sm p-1'>Banner</p>}
								</div>

								{!isBanner && (
									<button
										className='bg-green-700 rounded-md px-2 py-[4px] text-xs hover:bg-green-800 cursor-pointer transition-all mt-2'
										onClick={(e) => setBanner(index, e)}
									>
										Set as Banner
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}
			{images.length < 9 ? (
				<div
					{...getRootProps()}
					className='border-dashed border-[2px] border-[#ccc] rounded-md p-8 text-center cursor-pointer mb-10'
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p>Drop the files here ...</p>
					) : (
						<div className='text-gray-500'>
							<p>
								Drag &apos;n&apos; drop some files here, or click to select
								files
							</p>
							<p className='text-sm'>
								Only *.jpeg and *.png files are accepted.
							</p>
						</div>
					)}
				</div>
			) : (
				<div className='border-dashed border-[2px] border-[#ccc] rounded-md p-8 text-center cursor-pointer mb-10'>
					Maximum number of images reached: Only 10 images can be added to your
					project, please remove images if you want to replace them.
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
