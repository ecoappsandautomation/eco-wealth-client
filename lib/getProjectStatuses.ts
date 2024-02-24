const statuses = [
	{ name: "draft", options: ["pending_update_review", "archived"] },
	{
		name: "pending_update_review",
		options: [
			"pending_verification",
			"pending_reverification",
			"needs_updating",
			"approved",
			"published",
			"archived",
			"pending_update_review",
		],
	},
	{
		name: "pending_verification",
		options: [
			"pending_update_review",
			"pending_verification",
			"needs_updating",
			"archived",
		],
	},
	{
		name: "pending_reverification",
		options: ["pending_update_review", "archived"],
	},
	{ name: "needs_updating", options: ["pending_update_review", "archived"] },
	{
		name: "approved",
		options: ["published", "pending_update_review", "archived"],
	},
	{
		name: "published",
		options: ["fully_funded", "pending_update_review", "archived"],
	},
	{ name: "fully_funded", options: ["completed"] },
	{ name: "completed", options: ["matured"] },
	{ name: "matured", options: [""] },
	{ name: "archived", options: ["draft", "approved", "needs_updating"] },
];

export const getProjectStatuses = () => {
	return statuses;
};

export function isValidStatusChange(currentStatus: string, newStatus: string) {
	// Find the current status object in the array
	const currentStatusObject = statuses.find(
		(status) => status.name === currentStatus
	);

	// If the current status is not found, return false
	if (!currentStatusObject) {
		return false;
	}

	// Check if the new status is included in the options array of the current status
	return currentStatusObject.options.includes(newStatus);
}
