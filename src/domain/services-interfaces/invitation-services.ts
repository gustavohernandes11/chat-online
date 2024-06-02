import { IInvite } from "../models/invite"

export interface IInvitationServices
    extends IAskToJoinConversationService,
        IAcceptInvitationService,
        IListUserInvitationsService,
        IDeclineInvitationService,
        IListConversationInvitationsService,
        IRemoveInvitationService {}

export type IAskToJoinConversationService = {
    askToJoin(userId: string, conversationId: string): Promise<boolean>
}

export type IListUserInvitationsService = {
    listUserInvitations(userId: string): Promise<IInvite[]>
}

export type IListConversationInvitationsService = {
    listConversationInvitations(conversationId: string): Promise<IInvite[]>
}

export type IRemoveInvitationService = {
    removeInvitation(userId: string, conversationId: string): Promise<boolean>
}

export type IAcceptInvitationService = {
    accept(userId: string, conversationId: string): Promise<boolean>
}

export type IDeclineInvitationService = {
    decline(userId: string, conversationId: string): Promise<boolean>
}
