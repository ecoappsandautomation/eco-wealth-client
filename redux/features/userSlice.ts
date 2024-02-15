import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
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
	mfaFrequency: "",
	loadingUser: true,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<Partial<UserState>>) => {
			const userData = action.payload;
			if (userData.roles) state.roles = userData.roles;
			if (userData.loggedIn !== undefined) state.loggedIn = userData.loggedIn;
			if (userData.id) state.id = userData.id;
			if (userData.producerId) state.producerId = userData.producerId;
			if (userData.investorId) state.investorId = userData.investorId;
			if (userData.activeRole) state.activeRole = userData.activeRole;
			if (userData.currentTheme) state.currentTheme = userData.currentTheme;
			if (userData.email) state.email = userData.email;
			if (userData.phoneNumber) state.phoneNumber = userData.phoneNumber;
			if (userData.isVerified) state.isVerified = userData.isVerified;
			if (userData.name) state.name = userData.name;
			if (userData.totalUserTreeCount !== undefined)
				state.totalUserTreeCount = userData.totalUserTreeCount;
			if (userData.userTreeCount !== undefined)
				state.userTreeCount = userData.userTreeCount;
			if (userData.onboardingComplete !== undefined)
				state.onboardingComplete = userData.onboardingComplete;
			if (userData.investorOnboardingComplete !== undefined)
				state.investorOnboardingComplete = userData.investorOnboardingComplete;
			if (userData.producerOnboardingComplete !== undefined)
				state.producerOnboardingComplete = userData.producerOnboardingComplete;
			if (userData.emailNotification !== undefined)
				state.emailNotification = userData.emailNotification;
			if (userData.smsNotification !== undefined)
				state.smsNotification = userData.smsNotification;
			if (userData.pushNotification !== undefined)
				state.pushNotification = userData.pushNotification;
			if (userData.mfaVerified !== undefined)
				state.mfaVerified = userData.mfaVerified;
			if (userData.mfaVerifiedAt !== undefined)
				state.mfaVerifiedAt = userData.mfaVerifiedAt;
			if (userData.mfaEnabled !== undefined)
				state.mfaEnabled = userData.mfaEnabled;
			if (userData.mfaFrequency !== undefined)
				state.mfaFrequency = userData.mfaFrequency;
			if (userData.loadingUser !== undefined)
				state.loadingUser = userData.loadingUser;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
