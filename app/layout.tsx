"use client";
import "./globals.css";
import { Providers } from "@/redux/provider";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const path = usePathname();
	console.log("router path >>> ", path);
	return (
		<html
			lang='en'
			className='dark'
		>
			<body>
				<Providers>
					{path !== "/thankyou" &&
					path !== "/login" &&
					path !== "/signup" &&
					path !== "/i/onboarding" &&
					path !== "/p/onboarding" ? (
						<Header />
					) : null}
					<ToastContainer />
					{children}
				</Providers>
			</body>
		</html>
	);
}
