export interface IMessageServices
    extends ISendMessageService,
        IRemoveMessageService {}

export type ISendMessageService = {
    sendMessage(
        userId: string,
        conversationId: string,
        content: string
    ): Promise<boolean>
}

export type IRemoveMessageService = {
    removeMessage(requesterId: string, messageId: string): Promise<boolean>
}
