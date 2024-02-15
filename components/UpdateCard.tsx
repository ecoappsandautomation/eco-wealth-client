"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = { link: string; title: string; description: string };

export default function UpdateCard({ link, title, description }: Props) {
	const router = useRouter();
	// call to action button
	const handleKnowMoreClick = () => {
		router.push(link);
	};
	return (
		<div className='mb-8 md:w-[300px] w-[408px] bg-transparent rounded-2xl shadow-md relative md:mr-4 z-10 h-fit'>
			<a className='block text-inherit no-underline'>
				<Link
					href={`${link}`}
					passHref
				>
					<div>
						<div className='pt-[4px]'>
							{/* Project title */}
							<div className='flex flex-col'>
								<Link
									href={`${link}`}
									passHref
								>
									<h3 className='font-bold text-xl overflow-hidden overflow-ellipsis'>
										{title}
									</h3>
								</Link>
							</div>
							{/* Project description */}
							<div className='flex'>
								<Link
									href={`${link}`}
									passHref
									className='flex flex-[3] flex-col '
								>
									<p className='w-[90%] text-xs text-gray-400 overflow-hidden'>
										{description.substring(0, 150)}
										<span className='ml-[-2px]'>
											{description.length > 150 && "..."}
										</span>
									</p>
								</Link>
								{/* Call-to-action button */}
								<div className='flex flex-1 flex-col mt-2'>
									<button
										onClick={handleKnowMoreClick}
										className={`text-xs w-[100%] px-2 py-[4px] mb-2 border-none rounded-md bg-[var(--cta-one)] text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--cta-one-hover)]`}
									>
										Know More
									</button>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</a>
		</div>
	);
}
