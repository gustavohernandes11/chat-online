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
})
