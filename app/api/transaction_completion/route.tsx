import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest, res: NextResponse) {
	// TODO: notify producer of new investment
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { orderData } = await req.json();
	console.log("orderData >>> ", orderData);
	const orderAmount = parseInt(orderData.amount) * 0.01;
	const feeAmount = parseInt(orderData.fee_amount) * 0.01;
	const totalRaised = orderAmount - feeAmount;
	function addDays(date: any, days: number) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	const { data, error } = await supabase
		.from("transactions")
		.insert([
			{
				investor_id: orderData.investor_id,
				amount: totalRaised,
				order_total: orderAmount,
				refund_deadline: addDays(new Date(), 28),
				product: orderData.product,
				stripe_transaction_id: orderData.stripe_transaction_id,
				project_id: orderData.project_id,
				project_owner_id: orderData.project_owner_id,
				currency: orderData.currency,
				status: orderData.status,
				payment_method: orderData.payment_method[0],
				fee_amount: feeAmount,
				num_of_shares: orderData.num_of_shares,
			},
		])
		.select();
	if (error) {
		console.log("transaction error >>> ", error);
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	const transactionData = data && data[0];
	const { data: projectFinancialsData, error: projectFinancialsError } =
		await supabase
			.from("project_financials")
			.select("*")
			.eq("project_id", orderData.project_id);
	if (projectFinancialsError) {
		console.log("projectFinancialsError >>> ", projectFinancialsError);
		return NextResponse.json(
			{ message: projectFinancialsError.message },
			{ status: 502 }
		);
	}

	const totalAmountRaised =
		totalRaised + parseInt(projectFinancialsData[0]?.total_amount_raised || 0);

	const totalNumOfSharesSold =
		parseInt(orderData.num_of_shares) +
		parseInt(projectFinancialsData[0].num_of_shares_sold || 0);

	const { data: investorCountData, error: investorCountDataError } =
		await supabase
			.from("view_unique_investors_per_project")
			.select("*")
			.eq("project_id", orderData.project_id);
	if (investorCountDataError) {
		console.log("investorCountDataError >>> ", investorCountDataError);
		return NextResponse.json(
			{ message: investorCountDataError.message },
			{ status: 502 }
		);
	}

	await supabase
		.from("project_financials")
		.update({
			total_amount_raised: totalAmountRaised,
			num_of_shares_sold: totalNumOfSharesSold,
			total_number_of_investors: investorCountData[0].unique_investors_count,
		})
		.eq("project_id", orderData.project_id);
	const estReturnPerYearUntilRepayment =
		projectFinancialsData[0].est_return_per_share_until_repayment *
		orderData.num_of_shares;
	const estReturnPerYearAfterRepayment =
		projectFinancialsData[0].est_return_per_share_after_repayment *
		orderData.num_of_shares;
	// /////////////////  ////        ///  ///////////////// //////////////   /////////////////  ///      ///
	// ///		  		  //////      ///  ///               ///  		 ///  ///                 ///    ///
	// ///	              ///  ///    ///  ///               ///  	     ///  ///                  ///  ///
	// /////////////	  ///    ///  ///  /////////////     //////////////   ///                   //////
	// ///                ///     /// ///  ///               ///       ///    ///       ///////      ////
	// ///		  		  ///      //////  ///               ///		 ///  ///           ///      ////
	// /////////////////  ///  	     ////  ///////////////// ///    	  /// /////////////////      //// :)

	if (orderData.project_type === "Energy") {
		const { data: energyInvestmentData, error: energyInvestmentError } =
			await supabase
				.from("energy_investments")
				.select("*")
				.eq("investor_id", orderData.investor_id)
				.eq("project_id", orderData.project_id);
		if (energyInvestmentError) {
			console.log("energyInvestmentError >>> ", energyInvestmentError);
			return NextResponse.json(
				{ message: energyInvestmentError.message },
				{ status: 502 }
			);
		}
		if (energyInvestmentData.length > 0) {
			// Update logic here
			const newNumOfShares =
				parseInt(energyInvestmentData[0].num_of_shares) +
				parseInt(orderData.num_of_shares);
			const newAmountRaised =
				parseInt(energyInvestmentData[0].amount) + totalRaised;
			const newOrderAmount =
				parseInt(energyInvestmentData[0].order_amount) + orderAmount;
			const newEstReturnPerYearUntilRepayment =
				parseInt(energyInvestmentData[0].est_return_per_year_until_repayment) +
				estReturnPerYearUntilRepayment;
			const newEstReturnPerYearAfterRepayment =
				parseInt(energyInvestmentData[0].est_return_per_year_after_repayment) +
				estReturnPerYearAfterRepayment;
			const newKwhContributedPerYear =
				parseInt(energyInvestmentData[0].kwh_contributed_per_year) +
				parseInt(orderData.kwh_contributed_per_year);
			const newEstKwhPerShare =
				parseInt(energyInvestmentData[0].est_kwh_per_share) +
				parseInt(orderData.est_kwh_per_share);

			const updateData = {
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: newAmountRaised,
				order_amount: newOrderAmount,
				num_of_shares: newNumOfShares,
				transaction_ids: [
					...energyInvestmentData[0].transaction_ids,
					transactionData?.id,
				],
				kwh_contributed_per_year: newKwhContributedPerYear,
				est_kwh_per_share: newEstKwhPerShare,
				est_return_per_year_until_repayment: newEstReturnPerYearUntilRepayment,
				est_return_per_year_after_repayment: newEstReturnPerYearAfterRepayment,
				updated_at: new Date(),
			};

			const { error } = await supabase
				.from("energy_investments")
				.update(updateData)
				.eq("investor_id", orderData.investor_id)
				.eq("project_id", orderData.project_id);

			if (error) {
				console.error("Error updating energy investment data:", error);
				return NextResponse.json({ message: error.message }, { status: 502 });
			}
		} else {
			// Insert logic for new investment
			// (Assuming this should happen when the timestamps are not older than a day)
			const insertData = {
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: totalRaised,
				order_amount: orderAmount,
				num_of_shares: orderData.num_of_shares,
				transaction_ids: [transactionData?.id],
				kwh_contributed_per_year: orderData.kwh_contributed_per_year,
				est_kwh_per_share: orderData.est_kwh_per_share,
				est_return_per_year_until_repayment: estReturnPerYearUntilRepayment,
				est_return_per_year_after_repayment: estReturnPerYearAfterRepayment,
			};

			const { error: insertError } = await supabase
				.from("energy_investments")
				.insert([insertData]);
			if (insertError) {
				console.error("Error inserting energy investment data:", insertError);
				return NextResponse.json(
					{ message: insertError.message },
					{ status: 502 }
				);
			}
		}

		//
		// Here we look for the investor's metrics and update it if it exists, otherwise we create it.
		const { data: metricsData, error: metricsError } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", orderData.investor_id);

		if (metricsError || metricsData.length === 0) {
			console.log("metricsError >>> ", metricsError);
			//
			// Create new metrics
			const { error: metricsInsertError } = await supabase
				.from("investor_metrics")
				.insert([
					{
						investor_id: orderData.investor_id,
						total_est_kwh_contributed_per_year:
							orderData.kwh_contributed_per_year,
						total_arrays_installed: orderData.total_arrays_installed,
						total_homes_powered: orderData.homes_powered,
					},
				]);
			if (metricsInsertError) {
				return NextResponse.json(
					{ message: metricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing metrics
			const totalEstKwhContributedPerYear =
				parseInt(orderData.kwh_contributed_per_year) +
				parseInt(metricsData[0].total_est_kwh_contributed_per_year);

			const totalArraysInstalled =
				parseInt(orderData.total_arrays_installed) +
				parseInt(metricsData[0].total_arrays_installed);

			const totalHomesPowered =
				parseInt(orderData.homes_powered) +
				parseInt(metricsData[0].total_homes_powered);
			const { error: metricsUpdateError } = await supabase
				.from("investor_metrics")
				.update({
					total_est_kwh_contributed_per_year: totalEstKwhContributedPerYear,
					total_arrays_installed: totalArraysInstalled,
					total_homes_powered: totalHomesPowered,
				})
				.eq("investor_id", orderData.investor_id);
			if (metricsUpdateError) {
				return NextResponse.json(
					{ message: metricsUpdateError.message },
					{ status: 502 }
				);
			}
		}
		// Update producer metrics
		const { data: producerMetricsData, error: producerMetricsError } =
			await supabase
				.from("producer_metrics")
				.select("*")
				.eq("producer_id", orderData.project_owner_id);
		if (producerMetricsError || producerMetricsData.length === 0) {
			//
			// Create new metrics entry

			const { error: producerMetricsInsertError } = await supabase
				.from("producer_metrics")
				.insert([
					{
						producer_id: orderData.project_owner_id,
						total_raised: totalAmountRaised,
						total_tree_contributions_received: 0,
						num_of_investors: 1,
						total_kwh_contributions_received:
							orderData.kwh_contributed_per_year,
						total_shares_sold: orderData.num_of_shares,
						num_of_investors_paid: 0,
						total_paid_to_investors: 0,
						total_trees_planted: 0,
						total_kwh_generated: 0,
						total_carbon_offset: 0,
						total_homes_powered: 0,
						total_arrays_installed: 0,
					},
				]);
			if (producerMetricsInsertError) {
				return NextResponse.json(
					{ message: producerMetricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing metrics

			const { data: investorCountData, error: investorCountDataError } =
				await supabase
					.from("view_unique_investors_per_owner")
					.select("*")
					.eq("project_owner_id", orderData.project_owner_id);
			if (investorCountDataError) {
				console.log("investorCountDataError >>> ", investorCountDataError);
				return NextResponse.json(
					{ message: investorCountDataError.message },
					{ status: 502 }
				);
			}
			const { error: producerMetricsUpdateError } = await supabase
				.from("producer_metrics")
				.update({
					producer_id: orderData.project_owner_id,
					num_of_investors: investorCountData[0].unique_investors_count,
					total_raised:
						parseInt(producerMetricsData[0].total_raised) + totalAmountRaised,

					total_kwh_contributions_received:
						parseInt(producerMetricsData[0].total_kwh_contributions_received) +
						parseInt(orderData.kwh_contributed_per_year),
					total_shares_sold:
						parseInt(producerMetricsData[0].total_shares_sold) +
						parseInt(orderData.num_of_shares),
				})
				.eq("producer_id", orderData.project_owner_id);
			if (producerMetricsUpdateError) {
				return NextResponse.json(
					{ message: producerMetricsUpdateError.message },
					{ status: 502 }
				);
			}
		}

		return NextResponse.json(
			{
				message:
					"Order successfully completed. Thank you for investing in energy and the environment.",
			},
			{ status: 200 }
		);
	}

	// /////////////////  //////////////    /////////////////  /////////////////
	//       ///		  ///  		 ///    ///                ///
	//       ///	      ///  	     ///    ///                ///
	//       ///	      //////////////    //////////         //////////
	//       ///          ///       ///     ///                ///
	//       ///		  ///		 ///    ///                ///
	//       ///          ///    	  ///   /////////////////  ///////////////// :)

	if (orderData.project_type === "Tree") {
		console.log("processing tree investment api route");
		// Check for an existing tree investment
		const { data: treeInvestmentData, error: treeInvestmentError } =
			await supabase
				.from("tree_investments")
				.select("*")
				.eq("investor_id", orderData.investor_id)
				.eq("project_id", orderData.project_id);

		if (treeInvestmentError) {
			console.log(
				"error fetching tree investment data >>> ",
				treeInvestmentError
			);
			return NextResponse.json(
				{ message: treeInvestmentError.message },
				{ status: 502 }
			);
		}
		// If there is an existing tree investment
		if (treeInvestmentData.length > 0) {
			const newTotalRaised =
				parseInt(treeInvestmentData[0].amount) + totalRaised;
			const newOrderAmount =
				parseInt(treeInvestmentData[0].order_amount) + orderAmount;
			const newNumOfShares =
				parseInt(treeInvestmentData[0].num_of_shares) +
				parseInt(orderData.num_of_shares);
			const newTreesContributed =
				parseInt(treeInvestmentData[0].trees_contributed) +
				parseInt(orderData.trees_contributed);
			const newEstReturnPerYearUntilRepayment =
				parseInt(treeInvestmentData[0].est_return_per_year_until_repayment) +
				estReturnPerYearUntilRepayment;
			const newEstReturnPerYearAfterRepayment =
				parseInt(treeInvestmentData[0].est_return_per_year_after_repayment) +
				estReturnPerYearAfterRepayment;

			const updateData = {
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: newTotalRaised,
				order_amount: newOrderAmount,
				num_of_shares: newNumOfShares,
				transaction_ids: [
					...treeInvestmentData[0].transaction_ids,
					transactionData?.id,
				],
				trees_contributed: newTreesContributed,
				est_return_per_year_until_repayment: newEstReturnPerYearUntilRepayment,
				est_return_per_year_after_repayment: newEstReturnPerYearAfterRepayment,
				updated_at: new Date(),
			};
			const { error } = await supabase
				.from("tree_investments")
				.update(updateData)
				.eq("investor_id", orderData.investor_id)
				.eq("project_id", orderData.project_id);

			if (error) {
				console.log("error updating tree investment data >>> ", error);
				return NextResponse.json({ message: error }, { status: 502 });
			}
		} else {
			const { error } = await supabase.from("tree_investments").insert([
				{
					investor_id: orderData.investor_id,
					project_id: orderData.project_id,
					amount: totalRaised,
					order_amount: orderAmount,
					num_of_shares: orderData.num_of_shares,
					transaction_ids: [transactionData?.id],
					trees_contributed: orderData.trees_contributed,
					est_return_per_year_until_repayment: estReturnPerYearUntilRepayment,
					est_return_per_year_after_repayment: estReturnPerYearAfterRepayment,
				},
			]);
			if (error) {
				console.log("error inserting tree investment data >>> ", error);
				return NextResponse.json({ message: error }, { status: 502 });
			}
		}

		//
		// Here we look for the investor's metrics and update it if it exists, otherwise we create it.
		const { data: metricsData, error: metricsError } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", orderData.investor_id);
		console.log("metricsError >>> ", metricsError);
		if (metricsError) {
			console.log("metricsError >>> ", metricsError);
			return NextResponse.json(
				{ message: metricsError.message },
				{ status: 502 }
			);
		}

		if (metricsData?.length === 0) {
			//
			// Create new metrics data
			const { error: metricsInsertError } = await supabase
				.from("investor_metrics")
				.insert([
					{
						investor_id: orderData.investor_id,
						trees_contributed: orderData.trees_contributed,
					},
				]);
			if (metricsInsertError) {
				console.log("metricsInsertError >>> ", metricsInsertError);
				return NextResponse.json(
					{ message: metricsInsertError.message },
					{ status: 502 }
				);
			}
		}

		if (metricsData?.length > 0) {
			//
			// Update existing metrics
			const totalTreesContributed =
				parseInt(orderData.trees_contributed) +
				parseInt(metricsData[0].trees_contributed);
			const { error: metricsUpdateError } = await supabase
				.from("investor_metrics")
				.update({
					trees_contributed: totalTreesContributed,
				})
				.eq("investor_id", orderData.investor_id);
			if (metricsUpdateError) {
				console.log("metricsUpdateError >>> ", metricsUpdateError);

				return NextResponse.json(
					{ message: metricsUpdateError.message },
					{ status: 502 }
				);
			}
		}
		// Update producer metrics
		const { data: producerMetricsData, error: producerMetricsError } =
			await supabase
				.from("producer_metrics")
				.select("*")
				.eq("producer_id", orderData.project_owner_id);
		if (producerMetricsError) {
			console.log("producerMetricsError >>> ", producerMetricsError);
			return NextResponse.json(
				{ message: producerMetricsError.message },
				{ status: 502 }
			);
		}
		if (producerMetricsData.length === 0) {
			//
			// Create new metrics entry

			const { error: producerMetricsInsertError } = await supabase
				.from("producer_metrics")
				.insert([
					{
						producer_id: orderData.project_owner_id,
						total_raised: totalAmountRaised,
						num_of_investors: 1,
						total_tree_contributions_received: orderData.trees_contributed,
						total_kwh_contributions_received: 0,
						total_shares_sold: orderData.num_of_shares,
						num_of_investors_paid: 0,
						total_paid_to_investors: 0,
						total_trees_planted: 0,
						total_kwh_generated: 0,
						total_carbon_offset: 0,
						total_homes_powered: 0,
						total_arrays_installed: 0,
					},
				]);
			if (producerMetricsInsertError) {
				console.log(
					"producerMetricsInsertError >>> ",
					producerMetricsInsertError
				);
				return NextResponse.json(
					{ message: producerMetricsInsertError.message },
					{ status: 502 }
				);
			}
		}

		if (producerMetricsData.length > 0) {
			//
			// Update existing metrics
			console.log("updating producer metric data...");

			const { error } = await supabase
				.from("transactions")
				.select("*")
				.eq("project_owner_id", orderData.project_owner_id)
				.eq("investor_id", orderData.investor_id);
			if (error) {
				console.log("error pulling transaction data >>> ", error);
				return NextResponse.json({ message: error.message }, { status: 502 });
			}

			const { data: investorCountData, error: investorCountDataError } =
				await supabase
					.from("view_unique_investors_per_owner")
					.select("*")
					.eq("project_owner_id", orderData.project_owner_id);
			if (investorCountDataError) {
				console.log("investorCountDataError >>> ", investorCountDataError);
				return NextResponse.json(
					{ message: investorCountDataError.message },
					{ status: 502 }
				);
			}
			console.log("investorCountData >>> ", investorCountData);

			const { error: producerMetricsUpdateError } = await supabase
				.from("producer_metrics")
				.update({
					producer_id: orderData.project_owner_id,
					num_of_investors: investorCountData[0].unique_investors_count,
					total_raised:
						parseInt(producerMetricsData[0].total_raised) + totalAmountRaised,
					total_tree_contributions_received:
						parseInt(producerMetricsData[0].total_tree_contributions_received) +
						parseInt(orderData.trees_contributed),

					total_shares_sold:
						parseInt(producerMetricsData[0].total_shares_sold) +
						parseInt(orderData.num_of_shares),
				})
				.eq("producer_id", orderData.project_owner_id);
			if (producerMetricsUpdateError) {
				console.log(
					"producerMetricsUpdateError >>> ",
					producerMetricsUpdateError
				);
				return NextResponse.json(
					{ message: producerMetricsUpdateError.message },
					{ status: 502 }
				);
			}
		}

		return NextResponse.json(
			{
				message:
					"Order successfully completed. Thank you for investing in the environment.",
			},
			{ status: 200 }
		);
	}
}
