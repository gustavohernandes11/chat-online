import { IInvitationRepository } from "@/domain/repositories-interfaces/invitation-repository"
import { Collection } from "mongodb"
import { makeFakeInvite } from "../services/__mocks__/services-testing-factories"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"
import { InvitationMongoRepository } from "./invitation-mongo-repository"

describe("Invitation MongoDB Repository", () => {
    let invitationCollection: Collection

    beforeAll(async () => {
        await MongoHelper.connect(
            process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat-backend"
        )
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        invitationCollection = MongoHelper.getCollection("invitations")
        await invitationCollection.deleteMany({})
    })

    interface ISutTypes {
        sut: IInvitationRepository
    }

    const makeSut = (): ISutTypes => {
        return { sut: new InvitationMongoRepository() }
    }

    describe("save", () => {
        it("should save the invitation in the database", async () => {
            const { sut } = makeSut()
            const invitation = makeFakeInvite()

            const insertedId = await sut.save(invitation)
            const persisted = await invitationCollection.findOne({
                _id: parseToObjectId(insertedId!),
            })

            expect(persisted).toBeTruthy()
            expect(persisted?.conversationId).toBe(invitation.conversationId)
            expect(persisted?.status).toBe(invitation.status)
            expect(persisted?.userId).toBe(invitation.userId)
        })
    })

    describe("remove", () => {
        it("should remove the invitation from the database", async () => {
            const { sut } = makeSut()
            const invitation = makeFakeInvite()
            const insertedId = await sut.save(invitation)

            const wasRemoved = await sut.remove(insertedId!.toString())
            const persisted = await sut.get(insertedId!.toString())

            expect(wasRemoved).toBe(true)
            expect(persisted).toBeNull()
        })
    })

    describe("checkById", () => {
        it("should return true if the invitation exists", async () => {
            const { sut } = makeSut()
            const invitation = makeFakeInvite()
            const insertedId = await sut.save(invitation)

            const exists = await sut.checkById(insertedId!.toString())

            expect(exists).toBe(true)
        })

        it("should return false if the invitation does not exist", async () => {
            const { sut } = makeSut()
            const exists = await sut.checkById("non_existing_id")

            expect(exists).toBe(false)
        })
    })

    describe("updateStatus", () => {
        it("should update the status of the invitation", async () => {
            const { sut } = makeSut()
            const invitation = makeFakeInvite({ status: "pending" })
            const insertedId = await sut.save(invitation)

            const updated = await sut.updateStatus(
                insertedId!.toString(),
                "accepted"
            )
            const updatedInvitation = await invitationCollection.findOne({
                _id: parseToObjectId(insertedId!),
            })

            expect(updated).toBe(true)
            expect(updatedInvitation?.status).toBe("accepted")
        })
    })

    describe("get", () => {
        it("should return the invitation if it exists", async () => {
            const { sut } = makeSut()
            const invitation = makeFakeInvite()
            const insertedId = await sut.save(invitation)

            const retrieved = await sut.get(insertedId!.toString())

            expect(retrieved?.id).toBe(insertedId!.toString())
            expect(retrieved?.conversationId).toBe(invitation.conversationId)
            expect(retrieved?.status).toBe(invitation.status)
            expect(retrieved?.userId).toBe(invitation.userId)
            expect(retrieved?.createdAt).toBe(invitation.createdAt)
        })

        it("should return null if the invitation does not exist", async () => {
            const { sut } = makeSut()
            const retrieved = await sut.get("non-existing-id")

            expect(retrieved).toBeNull()
        })
    })

    describe("listUserInvitations", () => {
        it("should return invitations for the specified user", async () => {
            const { sut } = makeSut()
            const userId = "user123"
            const invitations = [
                makeFakeInvite({ userId }),
                makeFakeInvite({ userId }),
                makeFakeInvite({ userId }),
                makeFakeInvite({ userId: "any_other_id" }),
            ]
            await Promise.all(
                invitations.map(invitation => sut.save(invitation))
            )

            const retrieved = await sut.listUserInvitations(userId)

            expect(retrieved).toHaveLength(3)
        })
    })

    describe("listConversationInvitations", () => {
        it("should return invitations for the specified conversation", async () => {
            const { sut } = makeSut()
            const conversationId = "conversation123"
            const invitations = [
                makeFakeInvite({ conversationId }),
                makeFakeInvite({ conversationId }),
                makeFakeInvite({ conversationId }),
                makeFakeInvite({ conversationId: "any_other_id" }),
            ]
            await Promise.all(
                invitations.map(invitation => sut.save(invitation))
            )

            const retrieved = await sut.listConversationInvitations(
                conversationId
            )

            expect(retrieved).toHaveLength(3)
        })
    })
})
