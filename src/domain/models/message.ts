export type IMessage = {
    id: string
    date: string
    content: string
    senderId: string
    conversationId: string
}

export type IAddMessageModel = {
    content: string
    senderId: string
    conversationId: string
}
