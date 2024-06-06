import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { Collection } from "mongodb"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"
import { makeFakeAddConversationModel } from "./__mocks__/repository-testing-factories"
import { ConversationMongoRepository } from "./conversation-repository"

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
})
