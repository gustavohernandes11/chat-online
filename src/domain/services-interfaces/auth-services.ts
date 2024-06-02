import { IAddAccountModel } from "../models/account"
import {
    IAuthenticationModel,
    IAuthenticationResult,
} from "../models/authentication"

export interface IAuthServices extends IRegisterAccountService, IAuthService {}

export type IRegisterAccountService = {
    register(account: IAddAccountModel): Promise<boolean>
}

export type IAuthService = {
    auth(login: IAuthenticationModel): Promise<IAuthenticationResult | null>
}
