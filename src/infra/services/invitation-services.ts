import { IAddInvitationModel, IInvite } from "@/domain/models/invite"
import { IConversationRepository } from "@/domain/repositories-interfaces/conversation-repository"
import { IInvitationRepository } from "@/domain/repositories-interfaces/invitation-repository"
import { IInvitationServices } from "@/domain/services-interfaces/invitation-services"

export class InvitationServices implements IInvitationServices {
    constructor(
        private readonly conversationRepository: IConversationRepository,
        private readonly invitationRepository: IInvitationRepository
    ) {}

    async askToJoin(userId: string, conversationId: string): Promise<boolean> {
        const conversation = await this.conversationRepository.getById(
            conversationId
        )

        if (conversation) {
            const userInvitations =
                await this.invitationRepository.listUserInvitations(userId)

            const alreadyInvited = userInvitations
                .filter(invite => invite.status === "pending")
                .map(invite => invite.conversationId)
                .includes(conversationId)

            const alreadyInConversation = conversation.userIds.includes(userId)

            if (!alreadyInvited && !alreadyInConversation) {
                const invite: IAddInvitationModel = {
                    userId,
                    conversationId,
                    createdAt: new Date().toISOString(),
                    status: "pending",
                }
                return Boolean(this.invitationRepository.save(invite))
            }
        }

        return false
    }
    async accept(requesterId: string, invitationId: string): Promise<boolean> {
        const invitation = await this.invitationRepository.get(invitationId)

        if (invitation) {
            const conversation = await this.conversationRepository.getById(
                invitation.conversationId
            )
            if (conversation) {
                const requesterIsConversationOwner =
                    conversation.ownerId === requesterId

                if (requesterIsConversationOwner) {
                    return this.invitationRepository.updateStatus(
                        invitationId,
                        "accepted"
                    )
                }
            }
        }

        return false
    }
    async decline(requesterId: string, invitationId: string): Promise<boolean> {
        const invitation = await this.invitationRepository.get(invitationId)

        if (invitation) {
            const conversation = await this.conversationRepository.getById(
                invitation.conversationId
            )
            if (conversation) {
                const requesterIsConversationOwner =
                    conversation.ownerId === requesterId

                if (requesterIsConversationOwner) {
                    return this.invitationRepository.updateStatus(
                        invitationId,
                        "declined"
                    )
                }
            }
        }

        return false
    }
    async listUserInvitations(userId: string): Promise<IInvite[]> {
        const userInvitations =
            await this.invitationRepository.listUserInvitations(userId)

        return userInvitations
    }
    async listConversationInvitations(
        conversationId: string
    ): Promise<IInvite[]> {
        const conversationInvitations =
            await this.invitationRepository.listConversationInvitations(
                conversationId
            )

        return conversationInvitations
    }
    async removeInvitation(
        requesterId: string,
        invitationId: string
    ): Promise<boolean> {
        const invitation = await this.invitationRepository.get(invitationId)

        if (invitation) {
            const isOwnInvitation = invitation.userId === requesterId

            if (isOwnInvitation) {
                return this.invitationRepository.remove(invitationId)
            }
        }

        return false
    }
}
