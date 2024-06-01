import { IAddAccountModel } from "../models/account"
import {
    IAuthenticationModel,
    IAuthenticationResult,
} from "../models/authentication"

export interface IAuthService extends IRegisterAccount, IAuth {}

export type IRegisterAccount = {
    register(account: IAddAccountModel): Promise<boolean>
}

export type IAuth = {
    auth(login: IAuthenticationModel): Promise<IAuthenticationResult | null>
}
