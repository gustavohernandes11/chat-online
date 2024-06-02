import { IAddConversationModel } from "../models/conversation"
import { IMessage } from "../models/message"

export interface IConversationRepository
    extends ISaveConversationRepository,
        IRemoveConversationRepository,
        ICheckConversationByIdRepository,
        IListAllMessagesByConversationIdRepository {}

export type ISaveConversationRepository = {
    save(conversation: IAddConversationModel): Promise<string>
}

export type IRemoveConversationRepository = {
    remove(id: string): Promise<boolean>
}

export type ICheckConversationByIdRepository = {
    checkById(id: string): Promise<boolean>
}

export type IListAllMessagesByConversationIdRepository = {
    listAllMessages(id: string): Promise<IMessage[]>
}
