import React from "react";

type Props = {};

export default function About({}: Props) {
	return (
		<div>
			<div
				id='about'
				className='py-[100px] px-[64px]'
			>
				<h3 className='text-3xl font-bold'>
					The Vision: Create a Greener Tomorrow, Today.
				</h3>
				<div className='mt-8 '>
					<p>
						Eco Wealth is dedicated to revolutionizing how we invest in our
						planet&apos;s future. With a focus on sustainability and ecological
						impact, our app provides a unique platform for eco-conscious
						investors to back meaningful green projects.
					</p>
				</div>
			</div>
		</div>
	);
}
