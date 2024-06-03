import { IAddAccountModel } from "@/domain/models/account"
import {
    IAuthenticationModel,
    IAuthenticationResult,
} from "@/domain/models/authentication"
import { IEncrypter } from "@/domain/repositories-interfaces/encrypt-repository"
import { IHashRepository } from "@/domain/repositories-interfaces/hash-repository"
import { IAuthServices } from "@/domain/services-interfaces/auth-services"
import { IAccountRepository } from "../../domain/repositories-interfaces/account-repository"

export class AuthServices implements IAuthServices {
    constructor(
        private readonly accountRepository: IAccountRepository,
        private readonly encryptRepository: IEncrypter,
        private readonly hashRepository: IHashRepository
    ) {}

    async register(account: IAddAccountModel): Promise<boolean> {
        const inUseEmail = await this.accountRepository.getAccountByEmail(
            account.email
        )
        let success = false

        if (!inUseEmail) {
            const hashedPassword = await this.hashRepository.hash(
                account.password
            )

            success = await this.accountRepository.addNewAccount(
                Object.assign({ ...account, password: hashedPassword })
            )
        }

        return success
    }

    async auth(
        login: IAuthenticationModel
    ): Promise<IAuthenticationResult | null> {
        const account = await this.accountRepository.getAccountByEmail(
            login.email
        )

        if (account) {
            const isValid = await this.hashRepository.compare(
                login.password,
                account.password
            )

            if (isValid) {
                const accessToken = await this.encryptRepository.encrypt(
                    account.id
                )
                await this.accountRepository.updateAccessToken(
                    account.id,
                    accessToken
                )
                return { email: account.email, accessToken }
            }
        }

        return null
    }
}
