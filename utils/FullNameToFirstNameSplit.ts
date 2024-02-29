export default function FullNameToFirstNameSplit(fullName: string) {
	const splitName =
		fullName && fullName?.split(" ").length > 1
			? `${fullName?.split(" ")[0]} ${fullName
					?.split(" ")
					?.pop()?.[0]
					?.toUpperCase()}.`
			: fullName;
	return splitName;
}
