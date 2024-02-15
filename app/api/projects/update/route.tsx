import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	const {
		title,
		bannerUrl,
		imageUrls,
		coordinatorName,
		coordinatorPhone,
		description,
		status,
		projectType,
		totalArea,
		projectAddressId,
		treeTarget,
		fundsRequestedPerTree,
		treeType,
		fundsRequested,
		energyProductionTarget,
		numOfArrays,
		installedSystemSize,
		photovoltaicCapacity,
		estimatedInstallationCost,
		estimatedSystemCost,
		estimatedMaintenanceCost,
		installationTeam,
		connectWithSolarPartner,
		energyType,
		projectId,
	} = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});

	// Update the project in the 'projects' table
	let { data, error } = await supabase
		.from("projects")
		.update({
			title,
			updated_at: new Date().toISOString(),
			banner_url: bannerUrl,
			image_urls: imageUrls,
			project_coordinator_contact: {
				name: coordinatorName,
				phone: coordinatorPhone,
			},
			description,
			status,
			type: projectType,
			total_area_sqkm: totalArea,
			property_address_id: projectAddressId,
			is_verified: false,
		})
		.eq("id", projectId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// If the project type is 'Tree', update the 'tree_projects' table
	if (projectType === "Tree" && data) {
		const { data, error } = await supabase
			.from("tree_projects")
			.update({
				tree_target: treeTarget,
				funds_requested_per_tree: fundsRequestedPerTree,
				type: treeType,
			})
			.eq("id", projectId);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
	}

	// If the project type is 'Energy', update the 'energy_projects' table
	if (projectType === "Energy" && data) {
		const { data, error } = await supabase
			.from("energy_projects")
			.update({
				funds_requested: fundsRequested,
				energy_production_target: energyProductionTarget,
				num_of_arrays: numOfArrays,
				system_size_in_kw: installedSystemSize,
				system_capacity: photovoltaicCapacity,
				labour_cost: estimatedInstallationCost,
				estimated_system_cost: estimatedSystemCost,
				maintenance_cost: estimatedMaintenanceCost,
				type: energyType,
				installation_team: installationTeam,
				connect_with_solar_partner: connectWithSolarPartner,
			})
			.eq("id", projectId);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
	}

	return NextResponse.json(
		{ message: "Project updated successfully" },
		{ status: 200 }
	);
}
