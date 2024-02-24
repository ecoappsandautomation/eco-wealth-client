import React from "react";

type Props = {
	project: any;
};

export default function EnergyProject({ project }: Props) {
	const { entireProject, energyProjects, solarProjects } = project;
	return (
		<div>
			{solarProjects?.[0]?.locationType && (
				<p className='mb-2'>
					<span className='text-gray-400'>Project type:</span>{" "}
					{solarProjects?.[0]?.locationType}
				</p>
			)}
			<p className='mb-2'>
				<span className='text-gray-400'>Total funds requested:</span> $
				{entireProject?.projectFinancials.finalEstProjectFundRequestTotal.toLocaleString()}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Energy production target:</span>{" "}
				{energyProjects?.targetKwhProductionPerYear
					? energyProjects?.targetKwhProductionPerYear
					: 0}{" "}
				kWh
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Actual energy production:</span>{" "}
				{energyProjects?.energyProduced ? energyProjects?.energyProduced : 0}{" "}
				kWh
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Average yearly production:</span>{" "}
				{energyProjects?.avgYearlyProduction
					? energyProjects?.avgYearlyProduction
					: 0}{" "}
				kWh
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>Target number of arrays:</span>{" "}
				{solarProjects?.[0]?.numOfArrays ? solarProjects?.[0]?.numOfArrays : 0}
			</p>
			<p className='mb-2'>
				<span className='text-gray-400'>System size:</span>{" "}
				{solarProjects?.[0]?.systemSizeInKw
					? solarProjects?.[0]?.systemSizeInKw
					: 0}{" "}
				kW
			</p>
			{solarProjects?.[0]?.systemCapacity ? (
				<p className='mb-2'>
					<span className='text-gray-400'>System capacity:</span>{" "}
					{solarProjects?.[0]?.systemCapacity} kWh
				</p>
			) : null}
			{solarProjects?.[0]?.labourCost ? (
				<p className='mb-2'>
					<span className='text-gray-400'>Labour cost:</span> $
					{solarProjects?.[0]?.labourCost}
				</p>
			) : null}
			{solarProjects?.[0]?.systemCost ? (
				<p className='mb-2'>
					<span className='text-gray-400'>System cost:</span> $
					{solarProjects?.[0]?.systemCost}
				</p>
			) : null}
			{solarProjects?.[0]?.maintenanceCost ? (
				<p className='mb-2'>
					<span className='text-gray-400'>Maintenance cost:</span> $
					{solarProjects?.[0]?.maintenanceCost}
				</p>
			) : null}
			{/* <p className="mb-2">Installer details: {project.installerDetails.name}</p>  */}
			{energyProjects?.installationTeam ? (
				<p className='mb-2'>
					<span className='text-gray-400'>Installer type:</span>{" "}
					{energyProjects?.installationTeam}
				</p>
			) : null}
		</div>
	);
}
