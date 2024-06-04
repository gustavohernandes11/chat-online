import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IMessage } from "@/domain/models/message"
import { IAccountRepository } from "@/domain/repositories-interfaces/account-repository"
import { IConversationServices } from "@/domain/services-interfaces/conversation-services"
import { IConversationRepository } from "../../domain/repositories-interfaces/conversation-repository"

export class ConversationServices implements IConversationServices {
    constructor(
        private readonly conversationRepository: IConversationRepository,
        private readonly accountRepository: IAccountRepository
    ) {}

    async listConversations(userId: string): Promise<IConversationPreview[]> {
        const conversations =
            await this.conversationRepository.listAllConversations(userId)

        return conversations
    }

    async createNewConversation(
        userId: string,
        details: IAddConversationModel
    ): Promise<IConversation | null> {
        const accountExists = await this.accountRepository.checkById(userId)

        if (accountExists) {
            const conversation: IAddConversationModel = {
                ...details,
                ownerId: userId,
            }

            const insertedId = await this.conversationRepository.save(
                conversation
            )

            if (insertedId) {
                return await this.conversationRepository.getById(insertedId)
            }
        }
        return null
    }

    async listMessages(conversationId: string): Promise<IMessage[]> {
        const conversationExists = await this.conversationRepository.checkById(
            conversationId
        )

        if (conversationExists) {
            const messages = await this.conversationRepository.listAllMessages(
                conversationId
            )
            if (messages) return messages
        }
        return []
    }
    async removeConversation(
        requesterId: string,
        conversationId: string
    ): Promise<boolean> {
        const conversation = await this.conversationRepository.getById(
            conversationId
        )

        if (conversation) {
            const requesterIsConversationOwner =
                conversation.ownerId === requesterId
            if (requesterIsConversationOwner) {
                return await this.conversationRepository.remove(conversationId)
            }
        }
        return false
    }
    async removeParticipant(
        requesterId: string,
        userIdToRemove: string,
        conversationId: string
    ): Promise<boolean> {
        const conversation = await this.conversationRepository.getById(
            conversationId
        )
        if (conversation) {
            const belongsToConversation =
                conversation.userIds.includes(userIdToRemove)

            const requesterIsConversationOwner =
                conversation.ownerId === requesterId

            if (belongsToConversation && requesterIsConversationOwner) {
                return await this.conversationRepository.removeUserId(
                    userIdToRemove,
                    conversationId
                )
            }
        }

        return false
    }
}
