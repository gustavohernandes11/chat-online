export type IAccountModel = {
	id: string;
	name: string;
	email: string;
	createdAt: string;
};

export type IAddAccountModel = {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};
