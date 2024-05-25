import { IAccountRepository } from "../domain/repositories-interfaces/account-repository";
import { IConversationRepository } from "../domain/repositories-interfaces/conversation-repository";

export class AccountService {
	constructor(private readonly accountRepository: IAccountRepository) {}
}
