"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import EducationCard from "@/components/education/EducationCard";
import categories from "@/lib/getCategories";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
type EduCard = {
	id: string;
	title: string;
	url: string;
	imgUrl: string;
	shortDescription: string;
	category: string;
	role: string;
};

type Category = {
	category: string;
	role: "producer" | "investor" | "all";
	isVisible: boolean;
};

const EducationCenter = () => {
	const [cards, setCards] = useState<EduCard[]>([]);
	const [categoryLinks, setCategoryLinks] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const activeRole = useAppSelector((state) =>
		state.user?.activeRole?.toLowerCase()
	);
	const fetchCards = async (category: string) => {
		const apiUrl = "/api/edu/";
		let response: EduCard[] | null = null;
		if (category === "") {
			console.log("fetching all ", category);
			await axios
				.get<EduCard[]>(`${apiUrl}?category=all`)
				.then((res) => {
					response = res.data as EduCard[];
					console.log(res.data);
				})
				.catch((err) => console.log(err));
		} else {
			await axios
				.get<EduCard[]>(`${apiUrl}?category=${category}`)
				.then((res) => (response = res.data as EduCard[]))
				.catch((err) => {
					console.log(err);
					return setCards([]);
				});
		}
		if (response && (response as EduCard[]).length > 0) {
			const filteredCards = (response as EduCard[]).filter(
				(card) => card.role === activeRole || card.role === "all"
			);
			setCards(filteredCards);
		}
	};
	useEffect(() => {
		let filteredCategories = [] as Category[];
		if (activeRole === "producer") {
			filteredCategories = categories.filter(
				(category) => category.role === "producer" || category.role === "all"
			);
		} else if (activeRole === "investor") {
			filteredCategories = categories.filter(
				(category) => category.role === "investor" || category.role === "all"
			);
		}
		setCategoryLinks(filteredCategories);
	}, [activeRole]);

	useEffect(() => {
		// Fetch initial data
		fetchCards("");
	}, []);

	useEffect(() => {
		if (selectedCategory) {
			// Re-fetch data when category changes
			fetchCards(selectedCategory);
			return;
		}
		fetchCards("");
	}, [selectedCategory]);

	const handleCategoryClick = (category: string) => {
		if (category === selectedCategory) {
			setSelectedCategory("");
		} else {
			setSelectedCategory(category);
		}
	};

	return (
		<div className='flex md:flex-row flex-col'>
			<div className='custom-scrollbar flex md:flex-col p-2 md:p-4 xl:w-[14%] bg-[var(--bg-one)] overflow-x-scroll md:overflow-x-hidden md:overflow-y-scroll md:h-screen'>
				{categoryLinks.map(
					({ category, isVisible, role }) =>
						((isVisible && role === activeRole) ||
							(isVisible && role === "all")) && (
							<button
								key={category}
								onClick={() => handleCategoryClick(category)}
								className={`h-[max-content] text-sm md:text-base p-2 m-2 text-white rounded-full border-[1px] border-gray-700 hover:border-[var(--cta-one-hover)] transition-colors ${
									selectedCategory === category
										? "bg-[var(--cta-one)] border-[var(--cta-one)] hover:border-green-800 "
										: "bg-[var(--bg-one)]"
								}`}
							>
								{category}
							</button>
						)
				)}
			</div>

			<div className='card-list flex flex-wrap p-4 justify-start md:w-3/4 m-2'>
				{cards.length > 0 ? (
					cards.map((card: EduCard) => (
						<EducationCard
							key={card.id}
							title={card.title}
							url={card.url}
							imgUrl={card.imgUrl}
							shortDescription={card.shortDescription}
							category={card.category}
						/>
					))
				) : (
					<div className='flex flex-col items-center justify-center w-full h-full'>
						<h1 className='text-2xl font-bold text-center mb-2'>
							No lessons or resources found under {selectedCategory} yet.
						</h1>
						<p className='text-center'>Try changing your category.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default withAuth(EducationCenter);
