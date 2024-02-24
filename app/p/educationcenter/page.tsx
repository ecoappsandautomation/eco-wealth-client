"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

export default function EducationCenter({}: Props) {
	const router = useRouter();
	useEffect(() => {
		router.push("/educationcenter");
	}, []);
	return <div></div>;
}
