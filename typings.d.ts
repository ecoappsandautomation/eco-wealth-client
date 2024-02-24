// ---------------------
// User
// ---------------------
interface User {
	// Identifier
	id: string;

	// User Info
	name: string;
	email: string;
	phoneNumber: string;

	// User Status
	isVerified: boolean;
	onboardingComplete: boolean;
	investorOnboardingComplete: boolean;
	producerOnboardingComplete: boolean;

	// User Roles
	roles: string[];
	activeRole: string;

	// Counters
	totalUserTreeCount: number;
	userTreeCount: number;

	// Notifications
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;
}
interface UserState {
	// Identifier
	id: string | null;
	producerId: string | null;
	investorId: string | null;

	// User Info
	name: string | null;
	email: string | null;
	phoneNumber: string | null;

	// User Status
	loggedIn: boolean | null;
	isVerified: boolean;
	mfaEnabled: boolean;
	mfaVerified: boolean;
	mfaFrequency: string;
	loadingUser: boolean | null;

	// User Roles
	roles: string[];
	activeRole: string | null;

	// Onboarding
	onboardingComplete: boolean;
	investorOnboardingComplete: boolean;
	investorOnboardingSkipped: boolean;
	producerOnboardingComplete: boolean;

	// Notifications
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;

	// Counters
	totalUserTreeCount: number;
	userTreeCount: number;

	// Settings
	currentTheme: string | null;

	// Timestamps
	mfaVerifiedAt: string;

	// Referral
	refAgreement: boolean;
	referralId: string;
}

interface ProducerState {
	// Identifier
	id: string | null;

	// Producer Info
	name: string | null;

	// Producer Addresses
	producerProperties: Property[];
}

// ---------------------
// Producer Team
// ---------------------
interface Team {
	// Identifier
	id: string;

	// Team Info
	name: string;
	iconUrl: string;

	// Metadata
	createdAt: string;
}

// ---------------------
// Producer Properties
// ---------------------
interface Property {
	// Identifier
	id: string;

	// Producer
	producerId: string;

	// Verification Status
	isVerified: boolean;

	// Address
	address: {
		addressLineOne: string;
		addressLineTwo: string;
		city: string;
		stateProvince: string;
		postalCode: string;
		country: string;
	};

	// Timestamps
	createdAt: string;
	updatedAt: string;
}

// ---------------------
// Onboarding
// ---------------------
interface OnboardingState {
	// Address
	addressLineOne: string;
	addressLineTwo: string;
	city: string;
	stateProvince: string;
	postalCode: string;
	country: string;

	// Operation Details
	operationType: string[];
	treeTypes: string;
	solarTypes: string;
	treeOpSize: string;
	solarOpSize: string;
	producerGoal: string;
	hasSolarFarmOperation: string;
	hasTreeFarmOperation: string;

	// Additional Info
	propertyZoneMap: string;
	loadingMsg: string;
}

// ---------------------
// Project
// ---------------------
interface Project {
	// project meta data
	id?: string;
	userId: string | null;
	producerId: string | null;

	// timestamps
	createdAt: string;
	updatedAt: string;

	// project details
	title: string;
	description: string;
	externalUrl: string;
	imageUrls: ImageUrls;
	videoUrls: string[];
	status: string;
	type: string;
	isNonProfit: boolean;
	projectFinancials: ProjectFinancials;
	// type
	projectType?: string;
	treeProjectType: string;
	energyProjectType: string;

	// contact details
	projectCoordinatorContact: {
		name: string;
		phone: string;
	};

	// agreement
	agreementAccepted: boolean;

	// property & project area in km² details
	propertyAddressId: string;
	producerProperties: Property;
	totalAreaSqkm: number;

	// financial details
	requestedAmountTotal?: number;
	fundsCollected?: number;
	investorCount?: number;
	averageROI?: number;
	percentFunded?: number;
	estRevenue?: number;
	estRoiPercentage?: number;
	estRoiAmount?: number;

	// additional details for tree & energy projects
	treeProjects: TreeProject;
	energyProjects: EnergyProject;
	solarProjects: SolarProject[];

	// milestones
	projectMilestones?: ProjectMilestone;

	// investment transactions
	treeInvestments?: any;
	energyInvestments?: any;

	// financial kpis
	totalNumberOfInvestors?: number;
	totalAmountRaised?: number;

	// verified status
	isVerified: boolean;
	verificationId?: string;

	// soil organic content
	currentSoilOrganicContentPercentage?: number;
	targetSoilOrganicContentPercentage?: number;
}
type ImageUrls = {
	url: string;
	isBanner: boolean;
}[];
interface ProjectFinancials {
	id: string;
	projectId: string;
	numOfShares: number;
	amountPerShare: number;
	estRoiPercentagePerShareBeforeRepayment: number;
	estRoiPercentagePerShareAfterRepayment: number;
	isDeleted: boolean;
	deletedAt: string;
	finalEstProjectFundRequestTotal: number;
	totalAmountRaised: number;
	totalNumberOfInvestors: number;
	numOfSharesSold: number;
	estRoiAmount: number;
	estRoiPercentage: number;
	estLongTermRoiPercentage: number;
	roiAnalysis: string;
	estReturnPerShareUntilRepayment: number;
	estReturnPerShareAfterRepayment: number;
	estRevenue: number;
}

interface ProjectMilestone {
	// Identifier
	id: string;

	// Project Info
	projectId: string;
	title: string;
	shortDescription: string;
	body: string;

	// Timestamps
	createdAt: string;
	updatedAt: string;
	deletedAt: string;

	// Status
	isDeleted: boolean;
}

interface EnergyProject extends Project {
	// Financials
	totalFundsRequested: number;
	totalFundsRaised?: number;
	fundsRequestedPerKwh: number;

	// Energy Production
	targetKwhProductionPerYear: number;
	energyProduced?: number;
	energyProductionUnit?: string;
	energyProductionUnitValue?: number;
	avgYearlyProduction?: number;
	targetArrays: number;

	// Installation Details
	installerDetails?: {
		name: string;
	};
	installationTeam: string;

	// Partner Connection
	connectWithSolarPartner: string;
}

interface SolarProject extends EnergyProject {
	// System Specifications
	systemSizeInKw: number;
	systemCapacity: number;
	numOfArrays: number;
	locationType: string;

	// Estimated Costs
	estSystemCost: number;
	estLabourCost: number;
	estMaintenanceCost: number;
	estInstallationDate: string;
	estYearlyOutputInKwh: number;

	// Cost Details
	labourCost: number;
	systemCost: number;
	maintenanceCost: number;
}

interface TreeProject extends Project {
	// Tree Project Info
	treeTarget: number;
	treeCount: number;
	fundsRequestedPerTree: number;
	projectType: string;
	treeType: string;
	estSeedCost: number;
	estLabourCost: number;
	estMaintenanceCostPerYear: number;
	estPlantingDate: string | EpochTimeStamp;
	estMaturityDate: string | EpochTimeStamp;
	amountOfProduceGeneratedInKgToDate: number;
	avgRevenuePerItem: number;

	// Project Identifier
	projectId: string;

	// General Type
	type: string;
}

type Projects = Project[];
