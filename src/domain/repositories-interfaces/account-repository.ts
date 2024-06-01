import { IAccountId, IAccountModel, IAddAccountModel } from "../models/account"

export interface IAccountRepository
    extends IGetAccountByTokenRepository,
        IGetAccountByEmailRepository,
        IUpdateAccessTokenRepository,
        IAddNewAccountRepository,
        ICheckAccountByIdRepository,
        ICheckAccountByEmailRepository {}

export type IGetAccountByTokenRepository = {
    getAccountByToken(token: string, role?: string): Promise<IAccountId | null>
}

export type IGetAccountByEmailRepository = {
    getAccountByEmail(email: string): Promise<IAccountModel | null>
}

export type IUpdateAccessTokenRepository = {
    updateAccessToken(accountId: string, token: string): Promise<void>
}

export type IAddNewAccountRepository = {
    addNewAccount(account: IAddAccountModel): Promise<boolean>
}

export type ICheckAccountByIdRepository = {
    checkById(email: string): Promise<boolean>
}

export type ICheckAccountByEmailRepository = {
    checkByEmail(email: string): Promise<boolean>
}
