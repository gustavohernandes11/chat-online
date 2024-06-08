import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { Collection, ObjectId } from "mongodb"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"
import {
    makeFakeAddConversationModel,
    makeFakeConversation,
    makeFakeMessage,
} from "./__mocks__/repository-testing-factories"
import { ConversationMongoRepository } from "./conversation-mongo-repository"

describe("Conversation MongoDB Repository", () => {
    let conversationCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(
            process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat-backend"
        )
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        conversationCollection = MongoHelper.getCollection("conversations")
        await conversationCollection.deleteMany({})
    })

    interface ISutTypes {
        sut: IConversationRepository
    }

    const makeSut = (): ISutTypes => {
        return { sut: new ConversationMongoRepository() }
    }

    describe("save", () => {
        it("should save the conversation in the database", async () => {
            const { sut } = makeSut()
            const insertedId = await sut.save(makeFakeAddConversationModel())

            const recentlyAddedConversation =
                await conversationCollection.findOne({
                    _id: parseToObjectId(insertedId),
                })

            expect(recentlyAddedConversation).toBeTruthy()
        })
    })
    describe("remove", () => {
        it("should remove the conversation from the database", async () => {
            const { sut } = makeSut()
            const insertedId = await sut.save(makeFakeAddConversationModel())

            await sut.remove(insertedId)

            const removedConversation = await conversationCollection.findOne({
                _id: parseToObjectId(insertedId),
            })

            expect(removedConversation).toBeNull()
        })

        it("should return true when remove the conversation correctly", async () => {
            const { sut } = makeSut()
            const insertedId = await sut.save(makeFakeAddConversationModel())

            const wasRemoved = await sut.remove(insertedId)

            expect(wasRemoved).toBe(true)
        })
    })
    describe("checkById", () => {
        it("should return true when the conversation exists", async () => {
            const { sut } = makeSut()
            const insertedId = await sut.save(makeFakeAddConversationModel())

            const exists = await sut.checkById(insertedId)

            expect(exists).toBe(true)
        })
        it("should return false when the conversation don't exists", async () => {
            const { sut } = makeSut()

            const exists = await sut.checkById("nonexistent_id")

            expect(exists).toBe(false)
        })
    })
    describe("listAllMessages", () => {
        it("should return the correct messages from the conversation", async () => {
            const { sut } = makeSut()

            const fakeConversation = makeFakeConversation()
            const { insertedId } = await conversationCollection.insertOne(
                fakeConversation
            )

            const messages = await sut.listAllMessages(insertedId.toString())

            expect(messages).toEqual(fakeConversation.messages)
        })
    })
    describe("listAllConversations", () => {
        it("should list all the user's conversations", async () => {
            const { sut } = makeSut()
            const userId = "any_user_id"
            const conversations = [
                makeFakeConversation({ ownerId: userId }),
                makeFakeConversation({ ownerId: userId }),
                makeFakeConversation({ ownerId: userId }),
            ]
            await conversationCollection.insertMany(conversations)

            const userConversations = await sut.listAllConversations(userId)

            expect(userConversations.length).toBe(3)
        })
    })
    describe("getById", () => {
        it("should return the correct conversation by id", async () => {
            const { sut } = makeSut()
            const { insertedIds } = await conversationCollection.insertMany([
                makeFakeConversation({ name: "first_conversation" }),
                makeFakeConversation({ name: "second_conversation" }),
                makeFakeConversation({ name: "third_conversation" }),
            ])

            const firstConversation = await sut.getById(
                insertedIds[0].toString()
            )
            const secondConversation = await sut.getById(
                insertedIds[1].toString()
            )
            const thirdConversation = await sut.getById(
                insertedIds[2].toString()
            )

            expect(firstConversation?.name).toBe("first_conversation")
            expect(secondConversation?.name).toBe("second_conversation")
            expect(thirdConversation?.name).toBe("third_conversation")
        })
        it("should return null if the conversations doesn't exists", async () => {
            const { sut } = makeSut()

            const conversation = await sut.getById("unexistent_id")

            expect(conversation).toBeNull()
        })
    })
    describe("listUserIds", () => {
        it("should list all the conversation user ids", async () => {
            const { sut } = makeSut()
            const conversationId = await sut.save(
                makeFakeConversation({ userIds: ["1", "2", "3"] })
            )

            const ids = await sut.listUserIds(conversationId)

            expect(ids).toEqual(["1", "2", "3"])
        })
    })
    describe("removeUserId", () => {
        it("should remove only the passed user id from the conversation", async () => {
            const { sut } = makeSut()
            const conversationId = await sut.save(
                makeFakeConversation({ userIds: ["1", "2", "3"] })
            )

            await sut.removeUserId("2", conversationId)
            const ids = await sut.listUserIds(conversationId)

            expect(ids).toContain("1")
            expect(ids).not.toContain("2")
            expect(ids).toContain("3")
        })
        it("should return true on success", async () => {
            const { sut } = makeSut()
            const conversationId = await sut.save(
                makeFakeConversation({ userIds: ["1"] })
            )

            const acknowledged = await sut.removeUserId("1", conversationId)

            expect(acknowledged).toBe(true)
        })
        it("should return false when no id was found", async () => {
            const { sut } = makeSut()
            const conversationId = await sut.save(
                makeFakeConversation({ userIds: [] })
            )

            const acknowledged = await sut.removeUserId(
                "nonexistent_id",
                conversationId
            )

            expect(acknowledged).toBe(false)
        })
    })
    describe("saveMessage", () => {
        it("should save the message in the database", async () => {
            const { sut } = makeSut()
            const { insertedId } = await conversationCollection.insertOne(
                makeFakeConversation({ messages: [] })
            )

            await sut.saveMessage(
                makeFakeMessage({
                    conversationId: insertedId.toString(),
                    content: "any_content",
                })
            )

            const firstConversation = await sut.getById(insertedId.toString())

            expect(firstConversation?.messages.length).toBe(1)
        })
        it("should save the message in the correct conversation", async () => {
            const { sut } = makeSut()
            const conversations = [
                makeFakeConversation({ messages: [] }),
                makeFakeConversation({ messages: [] }),
                makeFakeConversation({ messages: [] }),
            ]
            const { insertedIds } = await conversationCollection.insertMany(
                conversations
            )

            await sut.saveMessage(
                makeFakeMessage({
                    conversationId: insertedIds[1].toString(),
                    content: "any_content",
                })
            )

            const [firstConversation, secondConversation, thirdConversation] =
                await Promise.all([
                    sut.getById(insertedIds[0].toString()),
                    sut.getById(insertedIds[1].toString()),
                    sut.getById(insertedIds[2].toString()),
                ])

            expect(firstConversation?.messages.length).toBe(0)
            expect(secondConversation?.messages.length).toBe(1)
            expect(thirdConversation?.messages.length).toBe(0)
        })
    })
    describe("getMessageById", () => {
        it("should get the correct message", async () => {
            const { sut } = makeSut()
            const targetId = new ObjectId()
            const conversations = [
                makeFakeConversation({
                    messages: [
                        makeFakeMessage({
                            _id: targetId,
                            content: "I'm the target message",
                        }),
                        makeFakeMessage({
                            _id: new ObjectId(),
                        }),
                        makeFakeMessage({
                            _id: new ObjectId(),
                        }),
                    ],
                }),
                makeFakeConversation(),
            ]
            const { insertedIds } = await conversationCollection.insertMany(
                conversations
            )
            const message = await sut.getMessageById(
                targetId.toString(),
                insertedIds[0].toString()
            )

            expect(message?.content).toBe("I'm the target message")
        })
    })
    describe("removeMessageContent", () => {
        it("should remove the target message content", async () => {
            const { sut } = makeSut()
            const conversation = makeFakeConversation({ messages: [] })
            const { insertedId } = await conversationCollection.insertOne(
                conversation
            )

            const messageId = new ObjectId()
            await sut.saveMessage(
                makeFakeMessage({
                    _id: messageId,
                    conversationId: insertedId.toString(),
                    content: "Please, kill me, I'm the target message.",
                })
            )

            const wasRemoved = await sut.removeMessageContent(
                messageId.toString(),
                insertedId.toString()
            )
            const message = await sut.getMessageById(
                messageId.toString(),
                insertedId.toString()
            )

            expect(messageId).not.toBeNull()
            expect(wasRemoved).toBe(true)
            expect(message!.content).toBe(null)
        })
        it("should not update other messages", async () => {
            const { sut } = makeSut()
            const conversation = makeFakeConversation({ messages: [] })
            const { insertedId } = await conversationCollection.insertOne(
                conversation
            )
            const targetId = new ObjectId()
            const notTargetId = new ObjectId()
            await sut.saveMessage(
                makeFakeMessage({
                    _id: notTargetId,
                    conversationId: insertedId.toString(),
                    content: "I should not be affected.",
                })
            )
            await sut.saveMessage(
                makeFakeMessage({
                    _id: targetId,
                    conversationId: insertedId.toString(),
                    content: "Please, kill me, I'm the target message.",
                })
            )
            sut.removeMessageContent(targetId.toString(), insertedId.toString())

            const [target, notTarget] = await Promise.all([
                sut.getMessageById(targetId.toString(), insertedId.toString()),
                sut.getMessageById(
                    notTargetId.toString(),
                    insertedId.toString()
                ),
            ])
            expect(target!.content).toBe(null)
            expect(notTarget!.content).toBe("I should not be affected.")
        })
    })
})
