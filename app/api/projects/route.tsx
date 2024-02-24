import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	try {
		const { projectData, producerId, projectId } = await req.json();

		// Here we check if there is a title, project type, project contact details, agreement accepted, and
		// address of operation
		if (!projectData.title || projectData.title === "") {
			return NextResponse.json(
				{ error: "Project title is required." },
				{ status: 400 }
			);
		}
		if (!projectData.projectType || projectData.projectType === "") {
			return NextResponse.json(
				{ error: "Project type is required." },
				{ status: 401 }
			);
		}
		if (
			!projectData.projectCoordinatorContact.name ||
			projectData.projectCoordinatorContact.name === ""
		) {
			return NextResponse.json(
				{ error: "Project contact name is required." },
				{ status: 402 }
			);
		}
		if (
			!projectData.projectCoordinatorContact.phone ||
			projectData.projectCoordinatorContact.phone === ""
		) {
			return NextResponse.json(
				{ error: "Project contact phone number is required." },
				{ status: 403 }
			);
		}
		if (!projectData.agreementAccepted) {
			return NextResponse.json(
				{
					error: "Agreement to project terms is required to submit a project.",
				},
				{ status: 404 }
			);
		}
		if (!projectData.propertyAddressId) {
			return NextResponse.json(
				{ error: "Project address of operation is required." },
				{ status: 405 }
			);
		}
		let totalFundsRequested = 0;

		console.log("projectData.projectType >>> ", projectData.projectType);
		if (projectData.projectType === "Tree") {
			totalFundsRequested =
				parseInt(projectData.estSeedCost) +
				parseInt(projectData.labourCost) +
				parseInt(projectData.maintenanceCost);
			console.log("projectData.seedCost >>> ", projectData.estSeedCost);
			console.log("projectData.labourCost >>> ", projectData.labourCost);
			console.log(
				"projectData.maintenanceCostPerYear >>> ",
				projectData.maintenanceCost
			);
		}
		if (
			projectData.projectType === "Energy" &&
			projectData.energyProjectType === "Solar"
		) {
			totalFundsRequested = parseInt(projectData.totalFundsRequested);
		}
		console.log("totalFundsRequested >>> ", totalFundsRequested);

		// TODO: create function to add project_id to verified_projects table on entry
		// Insert into projects table
		const { data: project, error } = await supabase
			.from("projects")
			.insert([
				{
					id: projectId,
					title: projectData.title,
					image_urls: projectData.imageUrls,
					video_urls: projectData.videoUrls,
					project_coordinator_contact: projectData.projectCoordinatorContact,
					description: projectData.description,
					producer_id: producerId,
					status: "pending_verification",
					type: projectData.projectType,
					agreement_accepted: projectData.agreementAccepted,
					total_area_sqkm: projectData.totalAreaSqkm,
					property_address_id: projectData.propertyAddressId,
					is_non_profit: projectData.isNonProfit,
					funds_requested: totalFundsRequested,
					est_revenue: projectData.estRevenue,
					est_roi_percentage: projectData.estRoiPercentage,
					est_long_term_roi_percentage: projectData.estLongTermRoiPercentage,
				},
			])
			.select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		const { data: projectFinancials, error: projectFinancialsError } =
			await supabase
				.from("project_financials")
				.insert([
					{
						project_id: project?.[0].id,
						final_est_project_fund_request_total: totalFundsRequested,
						est_revenue: projectData.estRevenue,
						est_roi_percentage: projectData.estRoiPercentage,
						est_long_term_roi_percentage: projectData.estLongTermRoiPercentage,
					},
				])
				.select();
		if (projectFinancialsError) {
			console.log("projectFinancialsError >>> ", projectFinancialsError);
			return NextResponse.json(
				{ error: projectFinancialsError.message },
				{ status: 501 }
			);
		}
		console.log("project >>> ", project);
		// Insert into tree_projects table if project type is Tree
		if (projectData.projectType === "Tree" && project) {
			const fundsRequestedPerTree =
				totalFundsRequested / projectData.treeTarget;
			if (projectData.treeProjectType === "Restoration") {
				const { error } = await supabase.from("tree_projects").insert([
					{
						project_id: project?.[0].id,
						tree_target: projectData.treeTarget,
						funds_requested_per_tree: fundsRequestedPerTree,
						project_type: projectData.treeProjectType,
						tree_type: projectData.treeType,
						tree_count: 0,
						producer_id: producerId,
						est_seed_cost: projectData.estSeedCost,
						est_labour_cost: projectData.labourCost,
						est_maintenance_cost_per_year: projectData.maintenanceCost,
						est_planting_date: projectData.estPlantingDate,
					},
				]);
				if (error) {
					return NextResponse.json({ error: error.message }, { status: 502 });
				}
			} else {
				const { error } = await supabase.from("tree_projects").insert([
					{
						project_id: project?.[0].id,
						tree_target: projectData.treeTarget,
						funds_requested_per_tree: fundsRequestedPerTree,
						project_type: projectData.treeProjectType,
						tree_type: projectData.treeType,
						tree_count: 0,
						producer_id: producerId,
						est_seed_cost: projectData.estSeedCost,
						est_labour_cost: projectData.labourCost,
						est_maintenance_cost_per_year: projectData.maintenanceCost,
						est_planting_date: projectData.estPlantingDate,
						est_maturity_date: projectData.estMaturityDate,
					},
				]);
				if (error) {
					return NextResponse.json({ error: error.message }, { status: 502 });
				}
			}
		}

		// Insert into energy_projects table if project type is Energy
		if (projectData.projectType === "Energy" && project) {
			// TODO: store installation team in a separate table and provide id to installer_id in solar_projects table
			const fundsRequestedPerKwh =
				totalFundsRequested / projectData.targetKwhProductionPerYear;

			const { data, error } = await supabase
				.from("energy_projects")
				.insert([
					{
						project_id: project?.[0].id,
						target_kwh_production_per_year:
							projectData?.targetKwhProductionPerYear,
						type: projectData?.energyProjectType,
						installation_team: projectData?.installerType,
						producer_id: producerId,
						funds_requested_per_kwh: fundsRequestedPerKwh,
					},
				])
				.select();
			if (error) {
				console.log("energy projects error >>> ", error.message);
				return NextResponse.json({ error: error.message }, { status: 502 });
			}
			if (projectData.energyProjectType === "Solar" && data) {
				console.log("data >>> ", data);
				const { error } = await supabase.from("solar_projects").insert([
					{
						project_id: project?.[0].id,
						energy_project_id: (data as any)?.[0]?.id,
						num_of_arrays: projectData?.targetArrays,
						est_yearly_output_in_kwh: projectData?.targetKwhProductionPerYear,
						system_size_in_kw: projectData?.systemSizeInKw,
						system_capacity: projectData?.systemCapacity,
						location_type: projectData?.locationType,
						est_labour_cost: projectData?.labourCost,
						est_system_cost: projectData?.systemCost,
						est_maintenance_cost_per_year: projectData?.maintenanceCostPerYear,
						connect_with_solar_partner: projectData?.connectWithSolarPartner,
						producer_id: producerId,
						est_material_cost: projectData?.materialCost,
						est_installation_date: projectData?.installationDate,
					},
				]);
				if (error) {
					console.log("solar projects error >>> ", error.message);
					return NextResponse.json({ error: error.message }, { status: 503 });
				}
			}
		}
		// notify admin of new project submission
		const sgMail = require("@sendgrid/mail");
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: "sajan@ecowealth.app", // Change to your recipient
			from: "sajan@ecowealth.app", // Change to your verified sender
			subject: `🔔 Eco Wealth — new project submitted by ${projectData.projectCoordinatorContact.name}`,
			html: `<strong>New project submission</strong></br>
			<p><b>Coordinator Details:</b></p>
			<p>name: ${projectData.projectCoordinatorContact.name}</p>
			<p>number: ${projectData.projectCoordinatorContact.phone}</p>
			</br>
			<p><b>Project Details:</b></p>
			<p><b>Project ID:</b> ${project?.[0].id}</p>
			<p>title: ${projectData.title}</p>
			<p>description: ${projectData.description}</p>
			<p>producer_id: ${producerId}</p>
			<p>type: ${projectData.projectType}</p>
			<p>total_area_sqkm: ${projectData.totalArea}</p>
			<p>property_address_id: ${projectData.propertyAddressId}</p>
			<p>funds_requested: ${totalFundsRequested}</p>
			<p>is_non_profit: ${projectData.isNonProfit}</p>
			`,
		};
		sgMail
			.send(msg)
			.then(() => {
				console.log("Email sent");
			})
			.catch((error: any) => {
				console.error(error);
			});
		// Send response
		return NextResponse.json(
			{ message: "Project created successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error creating project:", error);
		NextResponse.json(
			{ error: "An error occurred while creating the project" },
			{ status: 504 }
		);
	}
}

export async function GET(req: any, res: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { searchParams } = new URL(req.url);
	const projectType = searchParams.get("type");
	const nonProfit = searchParams.get("nonProfit") === "true"; // convert string to boolean
	console.log("projectType >>> ", projectType);
	console.log("nonProfit >>> ", nonProfit);
	if (!projectType) {
		return NextResponse.json({ error: "Missing projectType" }, { status: 400 });
	}
	if (typeof nonProfit !== "boolean") {
		return NextResponse.json({ error: "Missing nonProfit" }, { status: 401 });
	}
	let query;

	query = supabase
		.from("projects")
		.select(
			"*, project_milestones(*), tree_projects(*), energy_projects(*), solar_projects(*), project_financials(*)"
		)
		.eq("status", "published")
		.eq("is_verified", true)
		.eq("is_deleted", false);
	if (
		projectType === "Restoration" ||
		projectType === "Timber / Lumber" ||
		projectType === "Fruit" ||
		projectType === "Nut" ||
		projectType === "Bio Fuel" ||
		projectType === "Pulp" ||
		projectType === "Syrup" ||
		projectType === "Oil / Chemical"
	) {
		query = supabase
			.from("projects")
			.select(
				"*, project_milestones(*), tree_projects!inner(*), project_financials(*)"
			)
			.eq("status", "published")
			.eq("is_verified", true)
			.eq("is_deleted", false)
			.eq("tree_projects.project_type", projectType);
	} else if (
		projectType === "Solar"
		// ||
		// projectType === "Wind" ||
		// projectType === "Hydro" ||
		// projectType === "Geothermal" ||
		// projectType === "Nuclear" ||
		// projectType === "Biomass" ||
	) {
		query = supabase
			.from("projects")
			.select(
				"*, project_milestones(*), energy_projects!inner(*), solar_projects(*), project_financials(*)"
			)
			.eq("status", "published")
			.eq("is_verified", true)
			.eq("is_deleted", false)
			.eq("energy_projects.type", projectType);
	}

	// Check if nonProfit is true, if so, add a filter on is_non_profit
	if (nonProfit) {
		query = query.eq("is_non_profit", true);
	}

	let { data, error } = await query.order("created_at", { ascending: false });
	console.log("error >>> ", error);
	if (error) {
		console.error(error.message);
		NextResponse.json({ message: error.message }, { status: 500 });
	}

	if (data) {
		return NextResponse.json(data, { status: 200 });
	}
}

export async function PUT(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { projectId, status } = await req.json();
	const { error } = await supabase
		.from("projects")
		.update({
			status,
		})
		.eq("id", projectId);
	if (error) {
		console.error("Error updating project:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ message: "Project updated successfully" });
}

export async function DELETE(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { searchParams } = new URL(req.url);
	const projectId = searchParams.get("projectId");
	const projectType = searchParams.get("projectId");

	const deletedAt = new Date();
	const { error } = await supabase
		.from("projects")
		.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
		.eq("id", projectId)
		.select();
	if (error) {
		console.error("Error deleting project:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (projectType === "Tree") {
		const { error } = await supabase
			.from("tree_projects")
			.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
			.eq("project_id", projectId);
		if (error) {
			console.error("Error deleting tree project:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ message: "Project deleted successfully" });
	}

	if (projectType === "Energy") {
		const { error } = await supabase
			.from("energy_projects")
			.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
			.eq("project_id", projectId);
		if (error) {
			console.error("Error deleting energy project:", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ message: "Project deleted successfully" });
	}
}
