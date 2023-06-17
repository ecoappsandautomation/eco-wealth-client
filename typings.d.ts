interface User {
	name: string;
	email: string;
	phoneNumber: string;
	isVerified: boolean;
	roles: string[];
	id: string;
	activeRole: string;
	totalUserTreeCount: number;
	userTreeCount: number;
	onboardingComplete: boolean;
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;
	investorOnboardingComplete: boolean;
	producerOnboardingComplete: boolean;
}
interface UserState {
	roles: string[];
	loggedIn: boolean;
	roles: string[];
	id: string | null;
	activeRole: string | null;
	currentTheme: string | null;
	email: string | null;
	name: string | null;
	phoneNumber: string | null;
	isVerified: boolean;
	totalUserTreeCount: number;
	userTreeCount: number;
	onboardingComplete: boolean;
	emailNotification: boolean;
	smsNotification: boolean;
	pushNotification: boolean;
	investorOnboardingComplete: boolean;
	producerOnboardingComplete: boolean;
}

interface OnboardingState {
	addressLineOne: string;
	addressLineTwo: string;
	city: string;
	country: string;
	postalCode: string;
	stateProvince: string;
	operationType: string[];
	treeTypes: string;
	solarTypes: string;
	treeOpSize: string;
	solarOpSize: string;
	producerGoal: string;
	propertyZoneMap: string;
	hasSolarFarmOperation: string;
	hasTreeFarmOperation: string;
	loadingMsg: string;
}

interface Project {
	id: string;
	user_id: string | null;
	title: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
	role: string;
	tree_target: number;
	tree_count: number;
	image_url: string;
	status: string;
	type: string;
	funds_requested_per_tree: number;
	projectType: string;
	projectId: string;
	project_coordinator_contact: {
		name: string;
		phone: string;
	};
	project_verification_consent_given: boolean;
	admin_fee_consent: boolean;
	agree_to_pay_investor: boolean;
}

type Projects = Project[];
