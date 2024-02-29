import axios from "axios";
import DOMPurify from "dompurify";

type Props = {
	name: string;
	email: string;
	referralSource?: string;
	referrer?: string;
	specificReferral?: string;
	referralId?: string;
	router: any;
};
async function addToWaitingList({
	name,
	email,
	referralSource,
	referrer,
	specificReferral,
	referralId,
	router,
}: Props) {
	const sanitizedName = DOMPurify.sanitize(name);
	const sanitizedEmail = DOMPurify.sanitize(email);
	const sanitizedReferralSource = DOMPurify.sanitize(referralSource || "");
	const sanitizedReferrer = DOMPurify.sanitize(referrer || "");
	const sanitizedSpecificReferral = DOMPurify.sanitize(specificReferral || "");
	if (!referralId) {
		if (referralSource !== "") {
			await axios
				.post("/api/waiting_list", {
					name: sanitizedName,
					email: sanitizedEmail,
					referralSource: sanitizedReferralSource,
					specificReferral:
						sanitizedReferrer !== ""
							? sanitizedReferrer
							: sanitizedSpecificReferral,
				})
				.then((res) => {
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					console.log("/api/waiting_list >> err", err);
					return;
				});
		} else {
			await axios
				.post("/api/waiting_list", {
					name: sanitizedName,
					email: sanitizedEmail,
				})
				.then((res) => {
					router.push(
						`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
					);
					return;
				})
				.catch((err) => {
					console.log("/api/waiting_list >> err", err);
					return;
				});
		}
	} else {
		await axios
			.post("/api/waiting_list", {
				name: sanitizedName,
				email: sanitizedEmail,
				referralSource: sanitizedReferralSource,
				referrer: referralId,
				specificReferral:
					sanitizedReferrer !== ""
						? sanitizedReferrer
						: sanitizedSpecificReferral,
			})
			.then((res) => {
				router.push(
					`/thank-you-for-registering?name=${sanitizedName}&email=${sanitizedEmail}`
				);
				return;
			})
			.catch((err) => {
				console.log("/api/waiting_list >> err", err);
				return;
			});
	}
}

export default addToWaitingList;
