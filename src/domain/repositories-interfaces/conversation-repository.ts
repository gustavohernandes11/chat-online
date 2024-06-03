import {
    IAddConversationModel,
    IConversation,
    IConversationPreview,
} from "../models/conversation"
import { IMessage } from "../models/message"

export interface IConversationRepository
    extends ISaveConversationRepository,
        IRemoveConversationRepository,
        ICheckConversationByIdRepository,
        IListAllMessagesByConversationIdRepository,
        IListAllConversationsRepository,
        IGetByConversationByIdRepository,
        IRemoveUserIdFromConversationRepository,
        IListUserIdsFromConversationRepository {}

export type ISaveConversationRepository = {
    save(conversation: IAddConversationModel): Promise<string>
}

export type IRemoveConversationRepository = {
    remove(id: string): Promise<boolean>
}

export type ICheckConversationByIdRepository = {
    checkById(id: string): Promise<boolean>
}

export type IGetByConversationByIdRepository = {
    getById(id: string): Promise<IConversation>
}

export type IListAllMessagesByConversationIdRepository = {
    listAllMessages(conversationId: string): Promise<IMessage[] | null>
}

export type IListAllConversationsRepository = {
    listAllConversations(userId: string): Promise<IConversationPreview[]>
}

export type IRemoveUserIdFromConversationRepository = {
    removeUserId(userId: string, conversationId: string): Promise<boolean>
}

export type IListUserIdsFromConversationRepository = {
    listUserIds(conversationId: string): Promise<string[]>
}
