import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IAddMessageModel, IMessage } from "@/domain/models/message"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"

export class ConversationMongoRepository implements IConversationRepository {
    async save(conversation: IAddConversationModel): Promise<string> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const { insertedId } =
            conversationCollection &&
            (await conversationCollection.insertOne(conversation))

        return insertedId.toString()
    }
    async remove(id: string): Promise<boolean> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const { acknowledged } =
            conversationCollection &&
            (await conversationCollection.deleteOne({
                _id: parseToObjectId(id),
            }))

        return acknowledged
    }
    async checkById(id: string): Promise<boolean> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const conversation =
            conversationCollection &&
            (await conversationCollection.findOne({
                _id: parseToObjectId(id),
            }))

        return conversation !== null
    }
    listAllMessages(conversationId: string): Promise<IMessage[] | null> {
        throw new Error("Method not implemented.")
    }
    listAllConversations(userId: string): Promise<IConversationPreview[]> {
        throw new Error("Method not implemented.")
    }
    getById(id: string): Promise<IConversation | null> {
        throw new Error("Method not implemented.")
    }
    removeUserId(userId: string, conversationId: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    listUserIds(conversationId: string): Promise<string[]> {
        throw new Error("Method not implemented.")
    }
    saveMessage(message: IAddMessageModel): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
    getMessageById(messageId: string): Promise<IMessage | null> {
        throw new Error("Method not implemented.")
    }
    removeMessageContent(messageId: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
}
