import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "../models/conversation"
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
    listConversations(userId: string): Promise<IConversationPreview[]>
}

export type ICreateNewConversationService = {
    createNewConversation(
        userId: string,
        details: IAddConversationModel
    ): Promise<IConversation | null>
}

export type IRemoveConversationService = {
    removeConversation(conversationId: string): Promise<boolean>
}

export type IRemoveParticipantService = {
    removeParticipant(userId: string): Promise<boolean>
}
