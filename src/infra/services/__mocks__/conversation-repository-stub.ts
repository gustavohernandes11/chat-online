import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IAddMessageModel, IMessage } from "@/domain/models/message"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import {
    makeFakeConversation,
    makeFakeConversationPreview,
    makeFakeMessage,
} from "./testing-factories"

export class ConversationRepositoryStub implements IConversationRepository {
    async getMessageById(messageId: string): Promise<IMessage> {
        return makeFakeMessage({ id: messageId })
    }

    async removeMessageContent(messageId: string): Promise<boolean> {
        return true
    }

    async saveMessage(message: IAddMessageModel): Promise<boolean> {
        return true
    }

    async listUserIds(conversationId: string): Promise<string[]> {
        return ["1", "2", "3"]
    }
    async removeUserId(
        userId: string,
        conversationId: string
    ): Promise<boolean> {
        return true
    }
    async save(conversation: IAddConversationModel): Promise<string> {
        return "new_conversation_id"
    }

    async remove(id: string): Promise<boolean> {
        return true
    }

    async checkById(id: string): Promise<boolean> {
        return true
    }

    async getById(id: string): Promise<IConversation | null> {
        return makeFakeConversation({ id })
    }

    async listAllMessages(conversationId: string): Promise<IMessage[]> {
        return Promise.resolve([])
    }

    async listAllConversations(
        userId: string
    ): Promise<IConversationPreview[]> {
        return [
            makeFakeConversationPreview({ id: "1" }),
            makeFakeConversationPreview({ id: "2" }),
            makeFakeConversationPreview({ id: "3" }),
        ]
    }
}
