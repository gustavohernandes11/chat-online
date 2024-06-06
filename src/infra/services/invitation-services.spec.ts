import { IInvitationRepository } from "@/domain/repositories-interfaces/invitation-repository"
import { IInvitationServices } from "@/domain/services-interfaces/invitation-services"
import { ConversationRepositoryStub } from "./__mocks__/conversation-repository-stub"
import { InvitationRepositoryStub } from "./__mocks__/invitation-repository-stub"
import {
    makeFakeConversation,
    makeFakeInvite,
} from "./__mocks__/services-testing-factories"
import { InvitationServices } from "./invitation-services"

interface ISutType {
    sut: IInvitationServices
    invitationRepositoryStub: IInvitationRepository
    conversationRepositoryStub: ConversationRepositoryStub
}

const makeSut = (): ISutType => {
    const invitationRepositoryStub = new InvitationRepositoryStub()
    const conversationRepositoryStub = new ConversationRepositoryStub()
    const sut = new InvitationServices(
        conversationRepositoryStub,
        invitationRepositoryStub
    )
    return {
        sut,
        invitationRepositoryStub,
        conversationRepositoryStub,
    }
}

describe("InvitationServices", () => {
    describe("askToJoin", () => {
        it("should call the conversationRepository to verify if the conversation exists", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const getByIdSpy = jest.spyOn(conversationRepositoryStub, "getById")
            const conversationId = "any_conversation_id"
            const userId = "any_user_id"

            await sut.askToJoin(userId, conversationId)

            expect(getByIdSpy).toHaveBeenCalledWith(conversationId)
        })
        it("should return false if the conversation doesn't exist", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(null)
            const conversationId = "non_existent_conversation_id"
            const userId = "any_user_id"

            const result = await sut.askToJoin(conversationId, userId)

            expect(result).toBe(false)
        })
        it("should check the user invitations with listUserInvitations method", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const listUserInvitationsSpy = jest.spyOn(
                invitationRepositoryStub,
                "listUserInvitations"
            )
            const conversationId = "any_conversation_id"
            const userId = "any_user_id"

            await sut.askToJoin(userId, conversationId)

            expect(listUserInvitationsSpy).toHaveBeenCalledWith(userId)
        })
        it("should return false if the user already has a pending invitation for that conversation", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const conversationId = "conversation_id"
            const userId = "any_user_id"
            jest.spyOn(
                invitationRepositoryStub,
                "listUserInvitations"
            ).mockResolvedValueOnce([
                makeFakeInvite({
                    userId,
                    conversationId,
                    status: "pending",
                }),
            ])

            const result = await sut.askToJoin(userId, conversationId)

            expect(result).toBe(false)
        })
        it("should return false if the user is already in the conversation", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const userId = "user_id"
            const conversationId = "any_conversation_id"
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({ id: conversationId, userIds: [userId] })
            )

            const result = await sut.askToJoin(userId, conversationId)

            expect(result).toBe(false)
        })
        it("should call the save method", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const saveSpy = jest.spyOn(invitationRepositoryStub, "save")
            const conversationId = "any_conversation_id"
            const userId = "any_user_id"

            await sut.askToJoin(userId, conversationId)

            expect(saveSpy).toHaveBeenCalled()
        })
        it("should return true on success", async () => {
            const { sut } = makeSut()
            const conversationId = "any_conversation_id"
            const userId = "any_user_id"

            const result = await sut.askToJoin(userId, conversationId)

            expect(result).toBe(true)
        })
    })
    describe("accept", () => {
        it("should call the invitationRepository get method to check if it exists", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const getSpy = jest.spyOn(invitationRepositoryStub, "get")
            const invitationId = "any_invitation_id"
            const userId = "any_user_id"

            await sut.accept(userId, invitationId)

            expect(getSpy).toHaveBeenCalledWith(invitationId)
        })
        it("should return false if invitation doesn't exist", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                null
            )
            const invitationId = "non_existent_invitation_id"
            const userId = "any_user_id"

            const result = await sut.accept(userId, invitationId)

            expect(result).toBe(false)
        })
        it("should call the conversationRepository to verify if the conversation exists", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const getByIdSpy = jest.spyOn(conversationRepositoryStub, "getById")

            const accepterId = "any_accepter_id"
            const invitationId = "any_invitation_id"

            await sut.accept(accepterId, invitationId)

            expect(getByIdSpy).toHaveBeenCalled()
        })
        it("should return false if the requester is not the conversation owner", async () => {
            const {
                sut,
                conversationRepositoryStub,
                invitationRepositoryStub,
            } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                makeFakeInvite({
                    userId: "any_requester_id",
                })
            )
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({
                    ownerId: "different_owner_id",
                })
            )
            const accepterId = "any_accepter_id"
            const invitationId = "any_invitation_id"

            const result = await sut.accept(accepterId, invitationId)

            expect(result).toBe(false)
        })
        it("should call the invitationRepository updateStatus method with 'accepted'", async () => {
            const {
                sut,
                invitationRepositoryStub,
                conversationRepositoryStub,
            } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                makeFakeInvite({
                    userId: "any_user_id",
                })
            )
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({
                    ownerId: "any_user_owner_id",
                })
            )
            const updateStatusSpy = jest.spyOn(
                invitationRepositoryStub,
                "updateStatus"
            )
            const accepterId = "any_user_owner_id"
            const invitationId = "any_invitation_id"

            await sut.accept(accepterId, invitationId)

            expect(updateStatusSpy).toHaveBeenCalledWith(
                invitationId,
                "accepted"
            )
        })
        it("should return true on success", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const accepterId = "any_accepter_id"
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({ ownerId: accepterId })
            )
            const result = await sut.accept(accepterId, "any_invitation_id")

            expect(result).toBe(true)
        })
    })
    describe("decline", () => {
        it("should call the invitationRepository get method to check if it exists", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const getSpy = jest.spyOn(invitationRepositoryStub, "get")
            const invitationId = "any_invitation_id"
            const declinerId = "any_decliner_id"

            await sut.decline(declinerId, invitationId)

            expect(getSpy).toHaveBeenCalledWith(invitationId)
        })
        it("should return false if invitation doesn't exist", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                null
            )
            const invitationId = "non_existent_invitation_id"
            const declinerId = "any_decliner_id"

            const result = await sut.decline(declinerId, invitationId)

            expect(result).toBe(false)
        })
        it("should call the conversationRepository to verify if the conversation exists", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const getByIdSpy = jest.spyOn(conversationRepositoryStub, "getById")
            const invitationId = "any_invitation_id"
            const declinerId = "any_accepter_id"

            await sut.decline(declinerId, invitationId)

            expect(getByIdSpy).toHaveBeenCalled()
        })
        it("should return false if the requester is not the conversation owner", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({
                    ownerId: "different_owner_id",
                })
            )
            const invitationId = "any_invitation_id"
            const declinerId = "any_accepter_id"
            const result = await sut.decline(declinerId, invitationId)
            expect(result).toBe(false)
        })
        it("should call the invitationRepository updateStatus method with 'declined'", async () => {
            const {
                sut,
                invitationRepositoryStub,
                conversationRepositoryStub,
            } = makeSut()
            const invitationId = "any_invitation_id"
            const declinerId = "any_decliner_id"
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({
                    ownerId: declinerId,
                })
            )
            const updateStatusSpy = jest.spyOn(
                invitationRepositoryStub,
                "updateStatus"
            )

            await sut.decline(declinerId, invitationId)

            expect(updateStatusSpy).toHaveBeenCalledWith(
                invitationId,
                "declined"
            )
        })
        it("should return true on success", async () => {
            const { sut, conversationRepositoryStub } = makeSut()
            const declinerId = "any_decliner_id"
            jest.spyOn(
                conversationRepositoryStub,
                "getById"
            ).mockResolvedValueOnce(
                makeFakeConversation({
                    ownerId: declinerId,
                })
            )

            const result = await sut.decline(declinerId, "any_invitation_id")

            expect(result).toBe(true)
        })
    })
    describe("listUserInvitations", () => {
        it("should call the invitationRepository listUserInvitation method", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const listUserInvitationsSpy = jest.spyOn(
                invitationRepositoryStub,
                "listUserInvitations"
            )
            const userId = "any_user_id"

            await sut.listUserInvitations(userId)

            expect(listUserInvitationsSpy).toHaveBeenCalledWith(userId)
        })
        it("should return an empty array when there are no user invitations", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(
                invitationRepositoryStub,
                "listUserInvitations"
            ).mockResolvedValueOnce([])
            const userId = "any_user_id"

            const result = await sut.listUserInvitations(userId)

            expect(result).toEqual([])
        })
    })
    describe("listConversationInvitations", () => {
        it("should call the invitationRepository listConversationInvitations method", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const listConversationInvitationsSpy = jest.spyOn(
                invitationRepositoryStub,
                "listConversationInvitations"
            )
            const conversationId = "any_conversation_id"

            await sut.listConversationInvitations(conversationId)

            expect(listConversationInvitationsSpy).toHaveBeenCalledWith(
                conversationId
            )
        })
        it("should return an empty array when there are no conversation invitations", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(
                invitationRepositoryStub,
                "listConversationInvitations"
            ).mockResolvedValueOnce([])
            const conversationId = "any_conversation_id"

            const result = await sut.listConversationInvitations(conversationId)

            expect(result).toEqual([])
        })
    })
    describe("removeInvitation", () => {
        it("should call the invitationRepository get method to verify if it exists", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const getSpy = jest.spyOn(invitationRepositoryStub, "get")
            const invitationId = "any_invitation_id"
            const requesterId = "any_requester_id"

            await sut.removeInvitation(requesterId, invitationId)

            expect(getSpy).toHaveBeenCalledWith(invitationId)
        })
        it("should return false if invitation doesn't exist", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                null
            )
            const requesterId = "any_requester_id"
            const invitationId = "non_existent_invitation_id"

            const result = await sut.removeInvitation(requesterId, invitationId)

            expect(result).toBe(false)
        })
        it("should return false when the invitation is not from the requester user", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                makeFakeInvite({
                    userId: "any_user_id",
                })
            )
            const invitationId = "any_invitation_id"
            const differentRequesterId = "different_user_id"

            const result = await sut.removeInvitation(
                differentRequesterId,
                invitationId
            )

            expect(result).toBe(false)
        })
        it("should call the invitationRepository remove method", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const invitationId = "any_invitation_id"
            const userId = "any_user_id"
            const fakeInvitation = makeFakeInvite({
                id: invitationId,
                userId,
            })
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                fakeInvitation
            )
            const removeSpy = jest.spyOn(invitationRepositoryStub, "remove")

            await sut.removeInvitation(userId, invitationId)

            expect(removeSpy).toHaveBeenCalledWith(invitationId)
        })
        it("should return true on success", async () => {
            const { sut, invitationRepositoryStub } = makeSut()
            const userId = "any_user_id"
            jest.spyOn(invitationRepositoryStub, "get").mockResolvedValueOnce(
                makeFakeInvite({
                    userId,
                })
            )
            const invitationId = "any_invitation_id"

            const result = await sut.removeInvitation(userId, invitationId)

            expect(result).toBe(true)
        })
    })
})
