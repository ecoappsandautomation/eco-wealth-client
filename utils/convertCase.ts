export function convertSnakeCaseToUpper(input: string) {
	// Split the input string by underscores
	const parts = input.split("_");

	// Map over the parts and capitalize each one
	const capitalizedParts = parts.map(
		(part) => part.charAt(0).toUpperCase() + part.slice(1)
	);

	// Join the capitalized parts together
	const result = capitalizedParts.join(" ");

	return result;
}
