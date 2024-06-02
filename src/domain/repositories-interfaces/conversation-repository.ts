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
        IGetByConversationByIdRepository {}

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
    listAllMessages(conversationId: string): Promise<IMessage[]>
}

export type IListAllConversationsRepository = {
    listAllConversations(userId: string): Promise<IConversationPreview[]>
}
