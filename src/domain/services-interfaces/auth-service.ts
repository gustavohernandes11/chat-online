import { IAccountModel, IAddAccountModel } from "../models/account";
import {
	IAuthenticationModel,
	IAuthenticationResponse,
} from "../models/authentication";

export interface IAuthService extends IRegister, IAuth, IVerifyToken {}

export type IRegister = {
	register(account: IAddAccountModel): Promise<IAccountModel>;
};

export type IAuth = {
	auth(login: IAuthenticationModel): Promise<IAuthenticationResponse>;
};

export type IVerifyToken = {
	verifyToken(login: IAuthenticationModel): Promise<IAuthenticationResponse>;
};
