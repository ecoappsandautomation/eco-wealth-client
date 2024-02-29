// components/PinnedQuestionsSection.tsx

import FullNameToFirstNameSplit from "@/utils/FullNameToFirstNameSplit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CheckReferral from "./CheckReferral";
import WaitingListForm from "../WaitingListForm";

type Props = {};
const PinnedQuestions = ({}: Props) => {
	// pinned question variables
	const [question, setQuestion] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [pinnedQuestions, setPinnedQuestions] = useState<PinnedQuestion[]>([]);

	// wait list validation
	const [onWaitingList, setOnWaitingList] = useState(false);
	const [submittedQuestion, setSubmittedQuestion] = useState(false);

	const OnAddQuestion = (question: PinnedQuestion) => {
		axios
			.post("/api/questions", question)
			.then((response) => {
				console.log(response.data);
				setSubmittedQuestion(true);
				if (response.data.onWaitingList) {
					setOnWaitingList(true);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const handleAddQuestion = () => {
		if (!question || !fullName || !email) return;
		OnAddQuestion({ question, fullName, email, answered: false, answer: "" });
		setQuestion("");
		setFullName("");
		setEmail("");
	};
	useEffect(() => {
		axios
			.get("/api/questions")
			.then((response) => {
				setPinnedQuestions(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	const handleAddToWaitingList = () => {};
	if (!submittedQuestion) {
		return (
			<div>
				<h2 className='text-2xl font-semibold mb-4'>Pinned Questions</h2>
				<div className='mb-4'>
					<input
						type='text'
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						placeholder='Your Question'
						className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'
					/>
				</div>
				<div className='grid grid-cols-2 gap-4 mb-4'>
					<input
						type='text'
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						placeholder='Your Full Name'
						className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'
					/>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Your Email'
						className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'
					/>
				</div>
				<button
					onClick={handleAddQuestion}
					className='bg-blue-500 text-white font-semibold py-2 px-4 rounded-full mb-4'
				>
					Add Question
				</button>
				{pinnedQuestions.map(
					(
						{ question, fullName, email, dateAdded, answered, answer },
						index
					) => {
						if (answered) {
							return (
								<div
									key={index}
									className='mb-4'
								>
									<h3 className='text-lg font-semibold'>{question}</h3>
									<p className='text-sm text-gray-600'>
										Asked by {FullNameToFirstNameSplit(fullName)}
									</p>
								</div>
							);
						}
					}
				)}
			</div>
		);
	}
	if (submittedQuestion) {
		return (
			<div>
				<h2 className='text-2xl font-semibold mb-4'>
					Thanks for your question!
				</h2>
				{onWaitingList ? (
					<div>
						<p>
							We&apos;ll notify you when we have an answer and pin it if
							it&apos;s frequently asked.
						</p>
					</div>
				) : (
					<div>
						<p>Want to join the waiting list?</p>
						<WaitingListForm
							formHeight={"h-[100%]"}
							showLogo={false}
						/>
					</div>
				)}
			</div>
		);
	}
};
export default PinnedQuestions;
