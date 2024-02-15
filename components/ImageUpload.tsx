import axios from "axios";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
type Props = {
	onUpload: (files: any) => void;
	projectId: string;
};

const ImageUpload = ({ onUpload, projectId }: Props) => {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			async () =>
				await axios
					.post("/api/upload_project_img", {
						files: acceptedFiles,
						projectId,
					})
					.then((res) => {
						console.log("images uploaded >>> ", res);
					})
					.catch((err) => {
						console.log(err);
						toast.error("Failed to upload image");
					});
			onUpload(acceptedFiles);
		},
		[onUpload, projectId]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},
	});

	return (
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
						Drag &apos;n&apos; drop some files here, or click to select files
					</p>
					<p className='text-sm'>Only *.jpeg and *.png files are accepted.</p>
				</div>
			)}
		</div>
	);
};

const styles = {
	dropzone: {
		border: "2px dashed #cccccc",
		borderRadius: "4px",
		padding: "20px",
		textAlign: "center",
		cursor: "pointer",
		marginBottom: "20px",
	},
};

export default ImageUpload;
