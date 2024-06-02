import { IAccountId } from "../models/account"

export interface IMessageServices
    extends ISendMessageService,
        IRemoveMessageService {}

export type ISendMessageService = {
    sendMessage(
        userId: IAccountId,
        conversationId: string,
        content: string
    ): Promise<boolean>
}

export type IRemoveMessageService = {
    removeMessage(messageId: string): Promise<boolean>
}
