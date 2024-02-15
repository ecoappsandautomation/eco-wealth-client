"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseClient } from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RxAvatar } from "react-icons/rx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FiPower } from "react-icons/fi";
import {
	MdComment,
	MdSettings,
	MdContactSupport,
	MdBugReport,
	MdGroupAdd,
	MdUpdate,
} from "react-icons/md";
import { AiOutlineUserSwitch } from "react-icons/ai";
import Link from "next/link";
import { GiSolarPower } from "react-icons/gi";
import WaitingListMobileMenu from "./WaitingListMobileMenu";
import Logo from "./Logo";
import { useMediaQuery } from "@mui/material";
import { FaFolder, FaGraduationCap, FaHome } from "react-icons/fa";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { BASE_URL } from "@/constants";
import axios from "axios";
type Props = {};

const Header = ({}: Props) => {
	const supabase = supabaseClient;
	const router = useRouter();
	const dispatch = useAppDispatch();
	const activeRole = useAppSelector((state) => state.user?.activeRole);
	const currentTheme = useAppSelector((state) => state.user?.currentTheme);
	const user = useAppSelector((state) => state.user);
	const isLoggedIn = useAppSelector((state) => state.user?.loggedIn);
	const [render, setRender] = useState(false);
	const [theme, setTheme] = useState<string>(currentTheme || "dark");
	const path = usePathname();
	const loadingUser = useAppSelector((state) => state.user?.loadingUser);
	const matches = useMediaQuery("(min-width:768px)");
	useEffect(() => {
		path !== "/thankyou" &&
		path !== "/thank-you-for-registering" &&
		path !== "/register" &&
		path !== "/login" &&
		path !== "/signup" &&
		path !== "/forgot-password" &&
		path !== "/onboarding" &&
		path !== "/i/onboarding" &&
		path !== "/p/onboarding" &&
		path !== "/setup-mfa"
			? setRender(true)
			: setRender(false);
	}, [path]);
	// Avatar Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const switchRole = (role: String) => {
		fetch("/api/switch_active_role", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ role: role, userId: user?.id }),
		})
			.then((response) => response.json())
			.then(() => {
				handleClose();
			});
	};

	const handleToggleRole = () => {
		if (activeRole === "producer") {
			dispatch(setUser({ ...user, activeRole: "investor" }));
			router.push("/i/dashboard");
			switchRole("investor");
		} else if (activeRole === "investor") {
			dispatch(setUser({ ...user, activeRole: "producer" }));
			router.push("/p/dashboard");
			switchRole("producer");
		}
	};

	const handleAboutClick = () => {
		router.push("/#about");
	};

	const handlePricingClick = () => {
		router.push("/#pricing");
	};

	const handleStrategyClick = () => {
		router.push("/#strategy");
	};
	const handleHowItWorksClick = () => {
		router.push("/#how-it-works");
	};

	const handleLoginClick = () => {
		router.push("/login");
	};

	const handleSignupClick = () => {
		router.push("/signup");
	};

	// Logout logic
	const handleLogoutClick = async () => {
		// Handle logout logic here
		axios
			.post("/api/logout", {
				options: {
					setMFAFalse: true,
				},
				userId: user.id,
			})
			.then(() => {
				console.log("User logged out");
				dispatch(
					setUser({
						roles: [""],
						loggedIn: false,
						id: "",
						producerId: "",
						investorId: "",
						activeRole: "",
						currentTheme: "dark",
						email: "",
						name: "",
						phoneNumber: "",
						isVerified: false,
						totalUserTreeCount: 0,
						userTreeCount: 0,
						onboardingComplete: false,
						investorOnboardingComplete: false,
						producerOnboardingComplete: false,
						emailNotification: false,
						smsNotification: false,
						pushNotification: false,
						mfaEnabled: false,
						mfaVerified: false,
						mfaVerifiedAt: "",
						loadingUser: true,
					})
				);

				router.push("/login");
				router.refresh();
			})
			.catch((err) => {
				console.log("Error logging out user", err);
			});
	};
	const handleUpdateTheme = async (theme: string) => {
		await axios
			.post("/api/switch_theme", {
				userId: user.id,
				theme: theme,
			})
			.then((res) => {
				dispatch(setUser({ ...user, currentTheme: theme }));
				// Apply or remove the 'dark' class to the root HTML element
				if (theme === "light") {
					if (typeof window !== "undefined")
						document.documentElement.classList.add("dark");
				} else {
					if (typeof window !== "undefined")
						window.document.documentElement.classList.remove("dark");
				}
			})
			.catch((error) => {
				console.error("Error updating user theme:", error.message);
			});
	};

	// Here we toggle the theme between light and dark.
	const handleToggleTheme = () => {
		// Toggle the theme state between 'light' and 'dark'
		setTheme((prevTheme: string) => {
			const newTheme = prevTheme === "light" ? "dark" : "light";

			if (isLoggedIn) {
				handleUpdateTheme(newTheme);
			} else {
				// Apply or remove the 'dark' class to the root HTML element
				if (theme === "light") {
					if (typeof window !== "undefined")
						document.documentElement.classList.add("dark");
				} else {
					if (typeof window !== "undefined")
						window.document.documentElement.classList.remove("dark");
				}
			}
			return newTheme;
		});
	};

	// When the theme is initially loaded from redux and it's the 'light' class, we apply it
	// by removing 'dark' from the root html element.  Else, we leave the element alone.
	useEffect(() => {
		if (currentTheme === "light") {
			if (typeof window !== "undefined")
				document.documentElement.classList.remove("dark");
		}
	}, [currentTheme]);

	const handleDashboardClick = () => {
		if (activeRole === "investor") {
			router.push("/i/dashboard");
		}
		if (activeRole === "producer") {
			router.push("/p/dashboard");
		}
	};
	const handleDiscoverClick = () => {
		router.push("/i/discover");
	};

	const handlePortfolioClick = () => {
		router.push("/i/portfolio");
	};

	const handleAddProjectClick = () => {
		router.push("/p/add-project");
	};

	const handleMyProjectsClick = () => {
		router.push("/p/projects");
	};

	const handleEducationCenterClick = () => {
		router.push("/educationcenter");
	};

	const handleSettingsClick = () =>
		router.push("/settings?tab=personal-details");

	const handleWaitingListClick = () => router.push("/register");
	useEffect(() => {
		console.log("render >>> ", render);
		console.group("loading user >>> ", loadingUser);
	}, [render, loadingUser]);

	if (!render || loadingUser) return null;
	return (
		<div className='header-slide-in md:h-[9vh] z-[1000] flex justify-between items-center p-4 bg-gradient-to-r from-green-600 to-green-500 dark:bg-gradient-to-r dark:from-[#000308] dark:to-[#0C2100] dark:border-b-[var(--header-border)] border-b border-b-green-400 sticky top-0'>
			<Logo
				width={148}
				height={60}
			/>
			<div className='flex space-x-4 items-center'>
				{isLoggedIn ? (
					<>
						<a
							className='menu-link'
							onClick={handleDashboardClick}
						>
							{!matches ? (
								<FaHome className='text-3xl' />
							) : (
								<span className='flex items-center'>
									<FaHome className='text-2xl mr-2' />
									Dashboard
								</span>
							)}
						</a>
						{activeRole === "investor" && (
							<>
								<a
									className='menu-link'
									onClick={handleDiscoverClick}
								>
									{!matches ? (
										<RiCompassDiscoverFill className='text-3xl' />
									) : (
										<span className='flex items-center'>
											<RiCompassDiscoverFill className='text-2xl mr-2' />
											Discover
										</span>
									)}
								</a>
								<a
									className='menu-link'
									onClick={handlePortfolioClick}
								>
									{!matches ? (
										<FaFolder className='text-3xl' />
									) : (
										<span className='flex items-center'>
											<FaFolder className='text-2xl mr-2' /> Portfolio
										</span>
									)}
								</a>
							</>
						)}
						{activeRole === "producer" && (
							<>
								<a
									className='menu-link'
									onClick={handleMyProjectsClick}
								>
									{!matches ? (
										<FaFolder className='text-3xl' />
									) : (
										<span className='flex items-center'>
											<FaFolder className='text-lg mr-2' /> Projects
										</span>
									)}
								</a>
							</>
						)}
						<a
							className='menu-link'
							onClick={handleEducationCenterClick}
						>
							{!matches ? (
								<FaGraduationCap className='text-3xl' />
							) : (
								<span className='flex items-center'>
									<FaGraduationCap className='text-2xl mr-2' />
									Education Center
								</span>
							)}
						</a>
						<div
							className='cursor-pointer'
							id='basic-button'
							aria-controls={open ? "basic-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={open ? "true" : undefined}
							onClick={handleClick}
						>
							<RxAvatar className='avatar-menu-link' />
						</div>
						<Menu
							id='basic-menu'
							className=''
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
							disableScrollLock={true}
							sx={
								theme === "dark"
									? {
											"& .MuiPaper-root": {
												backgroundColor: "rgb(12 33 0 / 90%)",
												borderColor: "rgb(20 83 45 / 90%)",
												borderWidth: "2px",
											},
									  }
									: {
											"& .MuiPaper-root": {
												backgroundColor: "",
											},
									  }
							}
						>
							<MenuItem
								className='menu-link'
								onClick={handleSettingsClick}
							>
								<MdSettings className='mr-2' /> Account Settings
							</MenuItem>

							{user?.roles?.length > 1 ? (
								<>
									<MenuItem
										className='menu-link'
										onClick={handleToggleRole}
									>
										<AiOutlineUserSwitch className='mr-2' />
										Switch to{" "}
										{activeRole === "investor" ? "Producer" : "Investor"}
									</MenuItem>
								</>
							) : null}
							<Link href='/referral-center'>
								<MenuItem className='menu-link'>
									<MdGroupAdd className='mr-2' /> Referral Center
								</MenuItem>
							</Link>
							<Link
								href='https://ecoxsolar.com/'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<GiSolarPower className='mr-2' /> Get Home Solar
								</MenuItem>
							</Link>
							<Link
								href='/feedback'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdComment className='mr-2' /> Give Feedback
								</MenuItem>
							</Link>
							<Link
								href='mailto:support@ecowealth.app'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdContactSupport className='mr-2' /> Get Support
								</MenuItem>
							</Link>
							<Link
								href='mailto:support@ecowealth.app'
								target='_blank'
							>
								<MenuItem className='menu-link'>
									<MdBugReport className='mr-2' /> Report a Bug
								</MenuItem>
							</Link>
							<Link href='/updates'>
								<MenuItem className='menu-link'>
									<MdUpdate className='mr-2' /> News & Updates
								</MenuItem>
							</Link>
							{/* TODO: fix light & dark mode */}
							{/* <MenuItem
								className='menu-link'
								onClick={handleToggleTheme}
							>
								{theme === "light" ? (
									<>
										<BsFillMoonFill className='text-black mr-2' />
										Dark Mode
									</>
								) : (
									<>
										<BsFillSunFill className='text-yellow-300 mr-2' />
										Light Mode
									</>
								)}
							</MenuItem> */}
							<MenuItem
								className='menu-link'
								onClick={handleLogoutClick}
							>
								<FiPower className='mr-2' /> Logout
							</MenuItem>
						</Menu>
					</>
				) : (
					<>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-[var(--cta-two-hover)] transition-all text-gray-300 font-medium'
							onClick={handleAboutClick}
						>
							About
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-[var(--cta-two-hover)] transition-all text-gray-300 font-medium'
							onClick={handleStrategyClick}
						>
							Strategy
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-[var(--cta-two-hover)] transition-all text-gray-300 font-medium'
							onClick={handleHowItWorksClick}
						>
							How it works
						</a>
						<a
							className='hidden md:block scroll-smooth cursor-pointer hover:text-[var(--cta-two-hover)] transition-all text-gray-300 font-medium'
							onClick={handlePricingClick}
						>
							Pricing
						</a>
						<button
							className='cursor-pointer transition-all hover:scale-105 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-xs md:text-lg lg:px-8 px-4 py-2 glow'
							onClick={handleWaitingListClick}
						>
							Join the waiting list today
						</button>
						<WaitingListMobileMenu />
						{BASE_URL === "https://alpha.ecowealth.app" ||
							(BASE_URL === "http://localhost:3000" && (
								<div className='flex-col'>
									<a
										className='hidden md:block cursor-pointer hover:underline text-green-600 font-medium'
										onClick={handleLoginClick}
									>
										Login
									</a>
									<a
										className='hidden md:block cursor-pointer hover:underline text-green-600 font-medium'
										onClick={handleSignupClick}
									>
										Signup
									</a>
								</div>
							))}
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
