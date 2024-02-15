"use client";
import UpdateCard from "@/components/UpdateCard";
import { BASE_URL } from "@/constants";
import withAuth from "@/utils/withAuth";
import React from "react";

type Props = {};

function Updates({}: Props) {
	// list of memos
	const memoLinks = [`${BASE_URL}/memos/alpha-v1`];
	// more links to news and updates can be added here
	//
	//
	return (
		<div className='w-[90%] xl:w-[90vw] mx-auto py-8 h-[100%]'>
			<h1 className='text-2xl font-bold'>News & Updates</h1>
			<h2 className='font-light text-lg mb-8'>
				Stay up to date with the latest news and updates from Eco Wealth.
			</h2>
			<div className='flex flex-wrap gap-2 mb-8'>
				{memoLinks.map((link) => (
					<UpdateCard
						key={link}
						link={link}
						title='Alpha v1'
						description='The first version of our alpha product is now live. Check it out!'
					/>
				))}
			</div>
		</div>
	);
}

export default withAuth(Updates);
