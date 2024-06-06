import { IAddConversationModel } from "@/domain/models/conversation"
import { IMessage } from "@/domain/models/message"
import {
    IAccountRepository,
    ICheckAccountByIdRepository,
} from "@/domain/repositories-interfaces/account-repository"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { IConversationServices } from "@/domain/services-interfaces/conversation-services"
import { ConversationRepositoryStub } from "./__mocks__/conversation-repository-stub"
import {
    makeFakeConversation,
    makeFakeConversationPreview,
} from "./__mocks__/services-testing-factories"
import { ConversationServices } from "./conversation-services"
jest.useFakeTimers()

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
    describe("removeConversation", () => {
        it("should return false if the conversation does not exist", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            ).mockResolvedValueOnce(false)
            const requesterId = "requester_id"
            const conversationId = "non_existent_conversation_id"

            const result = await sut.removeConversation(
                requesterId,
                conversationId
            )

            expect(result).toBe(false)
        })

        it("should return false if the requester is not the owner of the conversation", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "different_owner_id",
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            const requesterId = "requester_id"
            const conversationId = "conversation_id"

            const result = await sut.removeConversation(
                requesterId,
                conversationId
            )

            expect(result).toBe(false)
        })

        it("should return true if the requester is the owner and the conversation is removed successfully", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "requester_id",
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            const requesterId = "requester_id"
            const conversationId = "conversation_id"

            const result = await sut.removeConversation(
                requesterId,
                conversationId
            )

            expect(result).toBe(true)
        })

        it("should return false if the requester is the owner but the removal fails", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "requester_id",
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            jest.spyOn(
                conversationRepositoryStub,
                "remove"
            ).mockResolvedValueOnce(false)
            const requesterId = "requester_id"
            const conversationId = "conversation_id"

            const result = await sut.removeConversation(
                requesterId,
                conversationId
            )

            expect(result).toBe(false)
        })
    })
    describe("removeParticipant", () => {
        it("should return false if the conversation does not exist", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            ).mockResolvedValueOnce(false)
            const requesterId = "requester_id"
            const userIdToRemove = "user_to_remove_id"
            const conversationId = "non_existent_conversation_id"

            const result = await sut.removeParticipant(
                requesterId,
                userIdToRemove,
                conversationId
            )

            expect(result).toBe(false)
        })

        it("should return false if the user to remove is not in the conversation", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                userIds: ["user_id_1", "user_id_2"],
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            const requesterId = "requester_id"
            const userIdToRemove = "user_to_remove_id"
            const conversationId = "conversation_id"

            const result = await sut.removeParticipant(
                requesterId,
                userIdToRemove,
                conversationId
            )

            expect(result).toBe(false)
        })

        it("should return false if the requester is not the conversation owner", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "different_owner_id",
                userIds: ["requester_id", "user_to_remove_id"],
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            const requesterId = "requester_id"
            const userIdToRemove = "user_to_remove_id"
            const conversationId = "conversation_id"

            const result = await sut.removeParticipant(
                requesterId,
                userIdToRemove,
                conversationId
            )

            expect(result).toBe(false)
        })

        it("should return true if the requester is the owner and the user is removed successfully", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "requester_id",
                userIds: ["requester_id", "user_to_remove_id"],
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            const requesterId = "requester_id"
            const userIdToRemove = "user_to_remove_id"
            const conversationId = "conversation_id"

            const result = await sut.removeParticipant(
                requesterId,
                userIdToRemove,
                conversationId
            )

            expect(result).toBe(true)
        })

        it("should return false if the requester is the owner but the user removal fails", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const conversation = makeFakeConversation({
                ownerId: "requester_id",
                userIds: ["requester_id", "user_to_remove_id"],
            })
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(conversation)
            jest.spyOn(
                conversationRepositoryStub,
                "removeUserId"
            ).mockResolvedValueOnce(false)
            const requesterId = "requester_id"
            const userIdToRemove = "user_to_remove_id"
            const conversationId = "conversation_id"

            const result = await sut.removeParticipant(
                requesterId,
                userIdToRemove,
                conversationId
            )

            expect(result).toBe(false)
        })
    })
})
