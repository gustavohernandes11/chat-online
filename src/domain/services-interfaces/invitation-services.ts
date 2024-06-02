import { IAccountId } from "../models/account"
import { IInvite } from "../models/invite"

export interface IInvitationServices
    extends IAskToJoinConversationService,
        IAcceptInvitationService,
        IListUserInvitationsService,
        IDeclineInvitationService,
        IListConversationInvitationsService,
        IRemoveInvitationService {}

export type IAskToJoinConversationService = {
    askToJoin(id: IAccountId, conversationId: string): Promise<boolean>
}

export type IListUserInvitationsService = {
    listUserInvitations(id: IAccountId): Promise<IInvite[]>
}

export type IListConversationInvitationsService = {
    listConversationInvitations(id: string): Promise<IInvite[]>
}

export type IRemoveInvitationService = {
    removeInvitation(id: IAccountId, conversationId: string): Promise<boolean>
}

export type IAcceptInvitationService = {
    accept(id: IAccountId, conversationId: string): Promise<boolean>
}

export type IDeclineInvitationService = {
    decline(id: IAccountId, conversationId: string): Promise<boolean>
}
