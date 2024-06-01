import { IMessage } from "../models/message"

export interface IConversationService
    extends IGetMessages,
        ICreateNewConversation {}

export type ICreateNewConversation = {
    createNewConversation(): Promise<string>
}

export type IGetMessages = {
    getMessages(conversationId: string): Promise<IMessage[]>
}
