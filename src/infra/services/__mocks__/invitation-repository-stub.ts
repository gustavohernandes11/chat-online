import {
    IAddInvitationModel,
    IInvite,
    IInviteStatus,
} from "@/domain/models/invite"
import { IInvitationRepository } from "@/domain/repositories-interfaces/invitation-repository"
import { makeFakeInvite } from "./services-testing-factories"

export class InvitationRepositoryStub implements IInvitationRepository {
    async listConversationInvitations(
        conversationId: string
    ): Promise<IInvite[]> {
        return [
            makeFakeInvite({ id: "1", conversationId }),
            makeFakeInvite({ id: "2", conversationId }),
            makeFakeInvite({ id: "3", conversationId }),
        ]
    }
    async save(invite: IAddInvitationModel): Promise<string | null> {
        const insertedId = "123"
        return insertedId
    }
    async remove(id: string): Promise<boolean> {
        return true
    }
    async checkById(id: string): Promise<boolean> {
        return true
    }
    async updateStatus(
        inviteId: string,
        status: IInviteStatus
    ): Promise<boolean> {
        return true
    }
    async get(id: string): Promise<IInvite> {
        return makeFakeInvite({ id })
    }
    async listUserInvitations(userId: string): Promise<IInvite[]> {
        return [
            makeFakeInvite({ id: "1", userId }),
            makeFakeInvite({ id: "2", userId }),
            makeFakeInvite({ id: "3", userId }),
        ]
    }
}
