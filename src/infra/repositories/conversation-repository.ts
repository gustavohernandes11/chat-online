import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IAddMessageModel, IMessage } from "@/domain/models/message"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { ObjectId } from "mongodb"
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
    async listAllMessages(conversationId: string): Promise<IMessage[] | null> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const conversation =
            conversationCollection &&
            (await conversationCollection.findOne(
                {
                    _id: parseToObjectId(conversationId),
                },
                {
                    projection: {
                        _id: 1,
                        messages: 1,
                    },
                }
            ))

        return conversation && conversation.messages
    }
    async listAllConversations(
        userId: string
    ): Promise<IConversationPreview[]> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const conversations =
            conversationCollection &&
            (await conversationCollection
                .find({
                    ownerId: userId,
                })
                .toArray())

        return conversations.map(conversation => MongoHelper.map(conversation))
    }
    async getById(id: string): Promise<IConversation | null> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const conversation =
            conversationCollection &&
            (await conversationCollection.findOne({ _id: parseToObjectId(id) }))

        return conversation && MongoHelper.map(conversation)
    }
    async listUserIds(conversationId: string): Promise<string[]> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")
        const conversation =
            conversationCollection &&
            (await conversationCollection.findOne(
                {
                    _id: parseToObjectId(conversationId),
                },
                {
                    projection: {
                        _id: 1,
                        userIds: 1,
                    },
                }
            ))

        return conversation && conversation.userIds
    }
    async removeUserId(
        userId: string,
        conversationId: string
    ): Promise<boolean> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")

        const { modifiedCount } =
            conversationCollection &&
            (await conversationCollection.updateOne(
                {
                    _id: parseToObjectId(conversationId),
                },
                // @ts-ignore
                { $pull: { userIds: { $in: [userId] } } }
            ))

        return modifiedCount > 0
    }
    async saveMessage(message: IAddMessageModel): Promise<string | null> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")

        const messageId = new ObjectId()
        const { modifiedCount } =
            conversationCollection &&
            (await conversationCollection.updateOne(
                {
                    _id: parseToObjectId(message.conversationId),
                },
                {
                    // @ts-ignore
                    $push: {
                        messages: {
                            _id: messageId,
                            date: new Date().toISOString(),
                            ...message,
                        },
                    },
                }
            ))

        return modifiedCount ? messageId.toString() : null
    }
    async getMessageById(
        messageId: string,
        conversationId: string
    ): Promise<IMessage | null> {
        const conversationCollection =
            MongoHelper.getCollection("conversations")

        const result = await conversationCollection
            .aggregate([
                {
                    $match: {
                        _id: parseToObjectId(conversationId),
                        "messages._id": parseToObjectId(messageId),
                    },
                },
                {
                    $project: {
                        messages: {
                            $filter: {
                                input: "$messages",
                                as: "message",
                                cond: {
                                    $eq: [
                                        "$$message._id",
                                        parseToObjectId(messageId),
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $unwind: "$messages",
                },
                {
                    $replaceRoot: { newRoot: "$messages" },
                },
            ])
            .toArray()

        const message = result.length > 0 ? result[0] : null

        return (message as IMessage) || null
    }
    async removeMessageContent(messageId: string): Promise<boolean> {
        throw new Error("Method not implemented.")
    }
}
