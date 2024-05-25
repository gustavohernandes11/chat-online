export type IAuthenticationModel = {
	email: string;
	password: string;
};

export type IAuthenticationResponse = {
	accessToken: string;
	email: string;
};
