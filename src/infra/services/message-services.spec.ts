import { IMessage } from "@/domain/models/message"
import { IAccountRepository } from "@/domain/repositories-interfaces/account-repository"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { IMessageServices } from "@/domain/services-interfaces/message-services"
import { AccountRepositoryStub } from "./__mocks__/account-repository-stub"
import { ConversationRepositoryStub } from "./__mocks__/conversation-repository-stub"
import { MessageServices } from "./message-services"

interface ISutType {
    sut: IMessageServices
    accountRepositoryStub: IAccountRepository
    conversationRepositoryStub: IConversationRepository
}

const makeSut = (): ISutType => {
    const accountRepositoryStub = new AccountRepositoryStub()
    const conversationRepositoryStub = new ConversationRepositoryStub()

    const sut = new MessageServices(
        conversationRepositoryStub,
        accountRepositoryStub
    )
    return {
        sut,
        accountRepositoryStub,
        conversationRepositoryStub,
    }
}

const makeFakeMessage = (overide?: IMessage): IMessage => {
    return Object.assign(
        {
            id: "any_id",
            conversationId: "1",
            senderId: "2",
            content: "any_content",
            date: new Date().toISOString(),
        },
        overide
    )
}

describe("MessageServices", () => {
    describe("sendMessage", () => {
        it("should return false if the user is not in the conversation", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "1"
            jest.spyOn(
                conversationRepositoryStub,
                "listUserIds"
            ).mockResolvedValue(
                ["1", "3"] // doesn't include the user id
            )

            const response = await sut.sendMessage(
                userId,
                conversationId,
                messageContent
            )

            expect(response).toBeFalsy()
        })

        it("should return false if the user doesn't exist", async () => {
            const { sut, accountRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "invalid_user_id"
            const conversationId = "1"
            jest.spyOn(accountRepositoryStub, "checkById").mockResolvedValue(
                false
            )

            const response = await sut.sendMessage(
                userId,
                conversationId,
                messageContent
            )

            expect(response).toBeFalsy()
        })

        it("should call the account repository checkById method to verify if the user exists", async () => {
            const { sut, accountRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "1"
            const checkByIdSpy = jest.spyOn(accountRepositoryStub, "checkById")

            await sut.sendMessage(userId, conversationId, messageContent)

            expect(checkByIdSpy).toHaveBeenCalledWith(userId)
        })

        it("should call the conversation repository checkById method to verify if the conversation exists", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "1"
            const checkByIdSpy = jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            )

            await sut.sendMessage(userId, conversationId, messageContent)

            expect(checkByIdSpy).toHaveBeenCalledWith(conversationId)
        })

        it("should return false if the conversation doesn't exist", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "invalid_conversation_id"
            jest.spyOn(
                conversationRepositoryStub,
                "checkById"
            ).mockResolvedValue(false)

            const response = await sut.sendMessage(
                userId,
                conversationId,
                messageContent
            )

            expect(response).toBeFalsy()
        })

        it("should call the conversation repository saveMessage method when the user is in the conversation", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "1"
            jest.spyOn(
                conversationRepositoryStub,
                "listUserIds"
            ).mockResolvedValue(["1", "2", "3"])
            const addMessageSpy = jest.spyOn(
                conversationRepositoryStub,
                "saveMessage"
            )

            await sut.sendMessage(userId, conversationId, messageContent)

            expect(addMessageSpy).toHaveBeenCalled()
        })

        it("should return true on success", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const messageContent = "any_text_content"
            const userId = "2"
            const conversationId = "1"
            jest.spyOn(
                conversationRepositoryStub,
                "listUserIds"
            ).mockResolvedValue(["1", "2", "3"])

            const result = await sut.sendMessage(
                userId,
                conversationId,
                messageContent
            )

            expect(result).toBe(true)
        })
    })
})
