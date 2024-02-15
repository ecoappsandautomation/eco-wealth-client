import { buffer } from "micro";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";
import axios from "axios";
const stripe = new Stripe(process.env.stripe_secret_key!, {
	apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest, res: NextResponse) {
	console.log("webhook called");
	// Stripe requires the raw body to construct the event.
	const sig = headers().get("stripe-signature") as string;
	const body = await req.text();
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.stripe_webhook_secret!
		);
	} catch (err) {
		return new Response(`Webhook Error: ${err}`, {
			status: 400,
		});
	}

	// Handle the checkout.session.completed event
	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		// console.log("webhook session >>> ", session);
		const {
			id,
			amount_subtotal,
			amount_total,
			customer_details,
			payment_method_types,
			status,
			metadata,
			currency,
		} = session;
		// console.log("Successful purchase! Customer", session.customer_details);
		if (!amount_total)
			return NextResponse.json({ error: "no amount total" }, { status: 503 });
		if (!metadata)
			return NextResponse.json({ error: "no metadata" }, { status: 503 });
		const feeAmount = amount_total * 0.03 + 1;

		const orderData = {
			investor_id: metadata.investorId,
			amount: amount_total,
			product: metadata.productName,
			stripe_transaction_id: id,
			project_id: metadata.projectId,
			project_owner_id: metadata.projectOwnerId,
			currency: currency,
			status: status,
			payment_method: payment_method_types,
			fee_amount: feeAmount,
			num_of_shares: metadata.numOfShares,
			project_type: metadata.projectType,
			funds_requested_per_tree: metadata.fundsRequestedPerTree,
			kwh_contributed_per_year: metadata.kwhContributedPerYear,
			trees_contributed: metadata.treesContributed,
			total_arrays_installed: metadata.arraysInstalled,
			homes_powered: metadata.homesPowered,
			est_kwh_per_share: metadata.estKwhPerShare,
		};

		// here we are sending orderData to '/api/transaction_completion' to complete the transaction
		await fetch(`${req.nextUrl.origin}/api/transaction_completion`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderData,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					return NextResponse.json(
						{ message: "transaction completed." },
						{ status: 200 }
					);
				} else {
					return NextResponse.json(
						{ message: "transaction failed." },
						{ status: res.status }
					);
				}
			})
			.catch((err) => {
				console.log("error in webhook route: ", err.message);
				return NextResponse.json({ error: err.message }, { status: 501 });
			});
	}
	// Return a response to acknowledge receipt of the event.
	return NextResponse.json({ received: true });
}
