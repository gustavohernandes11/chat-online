import {
    IAccountModel,
    IAddAccountModel,
    IAuthenticatedAccountInfo,
} from "@/domain/models/account"
import { IAccountRepository } from "@/domain/repositories-interfaces/account-repository"

export class AccountRepositoryStub implements IAccountRepository {
    getAccountByToken(
        token: string,
        role?: string | undefined
    ): Promise<IAuthenticatedAccountInfo | null> {
        return Promise.resolve({ id: "any_id" })
    }
    getAccountByEmail(email: string): Promise<IAccountModel | null> {
        return new Promise(resolve =>
            resolve({
                email: "any_email",
                id: "any_id",
                name: "any_name",
                password: "hashed_password",
            })
        )
    }
    async updateAccessToken(accountId: string, token: string): Promise<void> {}
    addNewAccount(account: IAddAccountModel): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
    checkById(email: string): Promise<boolean> {
        return Promise.resolve(true)
    }
    checkByEmail(email: string): Promise<boolean> {
        return Promise.resolve(true)
    }
}
