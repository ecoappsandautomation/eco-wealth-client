import { toast } from "react-toastify";

const copyToClipboard = (link: string) => {
	navigator.clipboard
		.writeText(link)
		.then(() => {
			// Display a success message or toast notification
			console.log("Referral link copied to clipboard!");
			toast.success("Referral link copied to clipboard!");
		})
		.catch((err) => {
			// Handle errors
			console.error("Failed to copy: ", err);
		});
};

export default copyToClipboard;
