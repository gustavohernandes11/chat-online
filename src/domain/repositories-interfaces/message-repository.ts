import { INewMessage } from "../models/message"

export interface IConversationRepository
    extends ISaveMessageRepository,
        IRemoveMessageRepository,
        ICheckMessageByIdRepository {}

export type ISaveMessageRepository = {
    save(message: INewMessage): Promise<string>
}

export type IRemoveMessageRepository = {
    remove(id: string): Promise<boolean>
}

export type ICheckMessageByIdRepository = {
    checkById(id: string): Promise<boolean>
}
