import { IAddAccountModel } from "@/domain/models/account";
import {
	IAuthenticationModel,
	IAuthenticationResult,
} from "@/domain/models/authentication";
import { IEncrypter } from "@/domain/repositories-interfaces/encrypt-repository";
import { IHashRepository } from "@/domain/repositories-interfaces/hash-repository";
import { IAuthService } from "@/domain/services-interfaces/auth-service";
import {
	IAddNewAccountRepository,
	IGetAccountByEmailRepository,
	IUpdateAccessTokenRepository,
} from "../../domain/repositories-interfaces/account-repository";

export class AuthService implements IAuthService {
	constructor(
		private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
		private readonly addNewAccountRepository: IAddNewAccountRepository,
		private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository,
		private readonly encryptRepository: IEncrypter,
		private readonly hashRepository: IHashRepository
	) {}

	async register(account: IAddAccountModel): Promise<boolean> {
		const inUseEmail =
			await this.getAccountByEmailRepository.getAccountByEmail(
				account.email
			);
		let success = false;

		if (!inUseEmail) {
			const hashedPassword = await this.hashRepository.hash(
				account.password
			);

			success = await this.addNewAccountRepository.addNewAccount(
				Object.assign({ ...account, password: hashedPassword })
			);
		}

		return success;
	}

	async auth(
		login: IAuthenticationModel
	): Promise<IAuthenticationResult | null> {
		const account =
			await this.getAccountByEmailRepository.getAccountByEmail(
				login.email
			);

		if (account) {
			const isValid = await this.hashRepository.compare(
				login.password,
				account.password
			);

			if (isValid) {
				const accessToken = await this.encryptRepository.encrypt(
					account.id
				);
				await this.updateAccessTokenRepository.updateAccessToken(
					account.id,
					accessToken
				);
				return { email: account.email, accessToken };
			}
		}

		return null;
	}
}
