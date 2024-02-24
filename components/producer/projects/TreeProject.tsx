import moment from "moment";
import React from "react";

type Props = {
	project: Project | null | undefined;
	treeProject: TreeProject | null | undefined;
};

export default function TreeProject({ project, treeProject }: Props) {
	return (
		<div>
			<p className='mb-2'>
				<span className='text-gray-400'>Tree Project Type:</span>{" "}
				{treeProject?.projectType}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Target Trees:</span>{" "}
				{treeProject?.treeTarget?.toLocaleString()}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Planted Trees:</span>{" "}
				{treeProject?.treeCount?.toLocaleString() || 0}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Funds requested per tree:</span> $
				{treeProject?.fundsRequestedPerTree}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Est planting date:</span>{" "}
				{moment(treeProject?.estPlantingDate).toDate().toDateString()}
			</p>
			{treeProject?.projectType !== "Restoration" && (
				<p className='mb-2'>
					<span className='text-gray-400'>Est project maturity date:</span>{" "}
					{moment(treeProject?.estMaturityDate).toDate().toDateString()}
				</p>
			)}
		</div>
	);
}
