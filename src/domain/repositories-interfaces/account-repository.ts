import { IAccountModel, IAddAccountModel } from "../models/account";

export type IAccountRepository = {
	checkIfEmailExists(email: string): Promise<boolean>;
	checkAccountById(email: string): Promise<boolean>;
	insertNewAccount(account: IAddAccountModel): Promise<IAccountModel>;
	getAccountByEmail(email: string): Promise<IAccountModel>;
	getAccountByToken(token: string): Promise<IAccountModel>;
	updateAccessToken(accountId: string, token: string): Promise<null>;
};
