import { IAccountId } from "../models/account"
import { IConversation, IConversationPreview } from "../models/conversation"
import { IMessage } from "../models/message"

export interface IConversationServices
    extends IListConversationsService,
        ICreateNewConversationService,
        IListMessagesService,
        IRemoveConversationService,
        IRemoveParticipantService {}

export type IListMessagesService = {
    listMessages(conversationId: string): Promise<IMessage[]>
}

export type IListConversationsService = {
    listConversations(userId: IAccountId): Promise<IConversationPreview[]>
}

export type ICreateNewConversationService = {
    createNewConversation(): Promise<IConversation>
}

export type IRemoveConversationService = {
    removeConversation(conversationId: string): Promise<boolean>
}

export type IRemoveParticipantService = {
    removeParticipant(id: IAccountId): Promise<boolean>
}
