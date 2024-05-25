import { IAccountModel, IAddAccountModel } from "../models/account";
import { IAuthenticationModel } from "../models/authentication";

export type IAccountService = {
	addAccount(account: IAddAccountModel): Promise<IAccountModel>;
	authenticate(login: IAuthenticationModel): Promise<IAuthenticationModel>;
};
