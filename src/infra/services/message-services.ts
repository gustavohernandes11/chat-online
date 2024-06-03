import { IAddMessageModel } from "@/domain/models/message"
import { IAccountRepository } from "@/domain/repositories-interfaces/account-repository"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { IMessageServices } from "@/domain/services-interfaces/message-services"

export class MessageServices implements IMessageServices {
    constructor(
        private readonly conversationRepository: IConversationRepository,
        private readonly accountRepository: IAccountRepository
    ) {}

    async sendMessage(
        senderId: string,
        conversationId: string,
        content: string
    ): Promise<boolean> {
        const [userExists, conversationExists] = await Promise.all([
            this.accountRepository.checkById(senderId),
            this.conversationRepository.checkById(conversationId),
        ])

        if (userExists && conversationExists) {
            const users = await this.conversationRepository.listUserIds(
                conversationId
            )
            const isInTheConversation = users.includes(senderId)

            if (isInTheConversation) {
                const message: IAddMessageModel = {
                    content,
                    conversationId,
                    senderId,
                }

                return this.conversationRepository.saveMessage(message)
            }
        }

        return false
    }
    async removeMessage(
        requesterId: string,
        messageId: string
    ): Promise<boolean> {
        const [userExists, message] = await Promise.all([
            this.accountRepository.checkById(requesterId),
            this.conversationRepository.getMessageById(messageId),
        ])

        if (userExists && message) {
            return this.conversationRepository.removeMessageContent(messageId)
        }

        return false
    }
}
