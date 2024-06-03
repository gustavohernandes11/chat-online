import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IMessage } from "@/domain/models/message"
import {
    IAccountRepository,
    ICheckAccountByIdRepository,
} from "@/domain/repositories-interfaces/account-repository"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { IConversationServices } from "@/domain/services-interfaces/conversation-services"
import { ConversationServices } from "./conversation-services"
jest.useFakeTimers()

const makeFakeConversationPreview = (
    override?: Partial<IConversationPreview>
): IConversationPreview => {
    return Object.assign(
        {
            id: "any_id",
            createdAt: new Date().toISOString(),
            description: "any_description",
            invitationCode: 123,
            name: "any_conversation_name",
            ownerId: "2",
            userIds: ["1", "2", "3", "4", "5"],
            visibility: "public",
        },
        override
    )
}

const makeFakeConversation = (
    override?: Partial<IConversation>
): IConversation => {
    return Object.assign(
        {
            id: "any_id",
            createdAt: new Date().toISOString(),
            description: "any_description",
            invitationCode: 123,
            name: "any_conversation_name",
            ownerId: "2",
            userIds: ["1", "2", "3", "4", "5"],
            visibility: "public",
            messages: [],
        },
        override
    )
}

class ConversationRepositoryStub implements IConversationRepository {
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

    async getById(id: string): Promise<IConversation> {
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

class CheckAccountByIdRepositoryStub implements ICheckAccountByIdRepository {
    checkById(email: string): Promise<boolean> {
        return Promise.resolve(true)
    }
}

interface ISutType {
    sut: IConversationServices
    checkAccountByIdRepositoryStub: ICheckAccountByIdRepository
    conversationRepositoryStub: IConversationRepository
}

const makeSut = (): ISutType => {
    const checkAccountByIdRepositoryStub = new CheckAccountByIdRepositoryStub()
    const conversationRepositoryStub = new ConversationRepositoryStub()

    const sut = new ConversationServices(
        conversationRepositoryStub,
        checkAccountByIdRepositoryStub as IAccountRepository
    )
    return {
        sut,
        checkAccountByIdRepositoryStub,
        conversationRepositoryStub,
    }
}

describe("ConversationService", () => {
    describe("listConversations", () => {
        it("should call listAllConversations method of IListAllConversationsRepository with correct userId", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const listSpy = jest.spyOn(
                conversationRepositoryStub,
                "listAllConversations"
            )
            const userId = "any_user_id"

            await sut.listConversations(userId)

            expect(listSpy).toHaveBeenCalledTimes(1)
            expect(listSpy).toHaveBeenCalledWith(userId)
        })
        it("should return an empty array when there are no conversations", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "listAllConversations"
            ).mockReturnValue(Promise.resolve([]))
            const userId = "any_user_id"

            const conversations = await sut.listConversations(userId)

            expect(conversations).toEqual([])
        })
        it("should return the correct conversations from the conversationsRepository", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const userId = "any_user_id"

            const expectedConversations =
                await conversationRepositoryStub.listAllConversations(userId)

            const conversations = await sut.listConversations(userId)

            expect(conversations).toEqual(expectedConversations)
        })
    })
    describe("createNewConversation", () => {
        it("should call the checkAccountByIdRepository with the correct id", async () => {
            const { sut, checkAccountByIdRepositoryStub } = makeSut()
            const checkByIdSpy = jest.spyOn(
                checkAccountByIdRepositoryStub,
                "checkById"
            )
            const userId = "any_user_id"
            const details = makeFakeConversationPreview({ ownerId: userId })

            await sut.createNewConversation(userId, details)

            expect(checkByIdSpy).toHaveBeenCalledWith(userId)
        })
        it("should return null if the account does not exist", async () => {
            const { sut, checkAccountByIdRepositoryStub } = makeSut()
            jest.spyOn(
                checkAccountByIdRepositoryStub,
                "checkById"
            ).mockResolvedValueOnce(false)
            const userId = "invalid_user_id"
            const details = makeFakeConversationPreview({
                ownerId: "invalid_user_id",
            })

            const result = await sut.createNewConversation(userId, details)

            expect(result).toBeNull()
        })
        it("should call the save method from the conversationRepository", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const saveSpy = jest.spyOn(conversationRepositoryStub, "save")
            const userId = "valid_user_id"
            const details = makeFakeConversationPreview({ ownerId: userId })

            await sut.createNewConversation(userId, details)

            expect(saveSpy).toHaveBeenCalledWith(details)
        })
        it("should call the getById method using the new inserted id", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const saveId = "new_conversation_id"
            const getByIdSpy = jest.spyOn(conversationRepositoryStub, "getById")
            const userId = "valid_user_id"
            const details: IAddConversationModel = {
                ownerId: userId,
                description: "any_description",
                name: "any_name",
                visibility: "public",
            }

            await sut.createNewConversation(userId, details)

            expect(getByIdSpy).toHaveBeenCalledWith(saveId)
        })
    })
    describe("listMessages", () => {
        it("should call the checkById method of the conversationRepository with the correct id", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const checkByIdSpy = jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            )
            const conversationId = "any_conversation_id"

            await sut.listMessages(conversationId)

            expect(checkByIdSpy).toHaveBeenCalledTimes(1)
            expect(checkByIdSpy).toHaveBeenCalledWith(conversationId)
        })

        it("should return an empty array if the conversation does not exist", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            ).mockResolvedValueOnce(false)
            const conversationId = "invalid_conversation_id"

            const result = await sut.listMessages(conversationId)

            expect(result).toEqual([])
        })

        it("should call the listAllMessages method of the conversationRepository with the correct id", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const listAllMessagesSpy = jest.spyOn(
                conversationRepositoryStub,
                "listAllMessages"
            )
            const conversationId = "valid_conversation_id"

            await sut.listMessages(conversationId)

            expect(listAllMessagesSpy).toHaveBeenCalledTimes(1)
            expect(listAllMessagesSpy).toHaveBeenCalledWith(conversationId)
        })

        it("should return the correct messages from the conversationRepository", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversationId = "valid_conversation_id"
            const expectedMessages: IMessage[] = [
                {
                    id: "1",
                    content: "Hello",
                    conversationId,
                    date: new Date().toISOString(),
                    senderId: "6",
                },
                {
                    id: "2",
                    content: "Hi",
                    conversationId,
                    date: new Date().toISOString(),
                    senderId: "7",
                },
            ]

            jest.spyOn(
                conversationRepositoryStub,
                "listAllMessages"
            ).mockResolvedValueOnce(expectedMessages)

            const result = await sut.listMessages(conversationId)

            expect(result).toEqual(expectedMessages)
        })

        it("should return an empty array if there are no messages", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversationId = "valid_conversation_id"
            jest.spyOn(
                conversationRepositoryStub,
                "listAllMessages"
            ).mockResolvedValueOnce([])

            const result = await sut.listMessages(conversationId)

            expect(result).toEqual([])
        })
    })
})
