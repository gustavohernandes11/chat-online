import { IAuthenticatedAccountInfo } from "../models/account"

export interface IMessageServices
    extends ISendMessageService,
        IRemoveMessageService {}

export type ISendMessageService = {
    sendMessage(
        userId: IAuthenticatedAccountInfo,
        conversationId: string,
        content: string
    ): Promise<boolean>
}

export type IRemoveMessageService = {
    removeMessage(messageId: string): Promise<boolean>
}
