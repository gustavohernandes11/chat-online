export type IMessage = {
    id: string
    date: string
    content: string
    senderId: string
    conversationId: string
}

export type INewMessage = {
    content: string
    senderId: string
    conversationId: string
}
