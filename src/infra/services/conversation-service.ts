import { IConversationRepository } from "../../domain/repositories-interfaces/conversation-repository"

export class ConversationService {
    constructor(
        private readonly conversationRepository: IConversationRepository
    ) {}
}
