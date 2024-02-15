import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai"; // Assuming you're using react-icons for the close icon as well

type Props = {};

export default function WaitingListMobileMenu({}: Props) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className='md:hidden'>
			<RxHamburgerMenu
				className='text-2xl'
				onClick={() => setIsMenuOpen(true)}
			/>

			{isMenuOpen && (
				<div
					className={`absolute top-0 left-0 h-screen w-full bg-green-950 flex flex-col transform transition-opacity duration-500 ${
						isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
					}`}
					style={{ transition: "visibility 0s, opacity 0.5s linear" }}
				>
					<button
						onClick={() => setIsMenuOpen(false)}
						className='self-end p-4'
					>
						<AiOutlineClose className='text-2xl' />
					</button>
					<a
						href='/#about'
						className='p-4 border-b border-gray-200'
						onClick={() => setIsMenuOpen(false)}
					>
						About
					</a>
					<a
						href='/#strategy'
						className='p-4 border-b border-gray-200'
						onClick={() => setIsMenuOpen(false)}
					>
						Strategy
					</a>
					<a
						href='/#how-it-works'
						className='p-4 border-b border-gray-200'
						onClick={() => setIsMenuOpen(false)}
					>
						How it works
					</a>
					<a
						href='/#pricing'
						className='p-4 border-b border-gray-200'
						onClick={() => setIsMenuOpen(false)}
					>
						Pricing
					</a>
					<a
						href='/register'
						className='p-4'
						onClick={() => setIsMenuOpen(false)}
					>
						Join the waiting list today
					</a>
					<a
						href='/login'
						className='p-4'
						onClick={() => setIsMenuOpen(false)}
					>
						Login
					</a>
					<a
						href='/signup'
						className='p-4'
						onClick={() => setIsMenuOpen(false)}
					>
						Signup
					</a>
				</div>
			)}
		</div>
	);
}
