import { IMessage } from "./message"

export type IVisibilityOptions = "public" | "private"
export type IConversation = {
    id: string
    name: string
    description: string
    messages: IMessage[]
    ownerId: string
    userIds: string[]
    createdAt: string
    visibility: IVisibilityOptions
    invitationCode: number
}

export type IAddConversationModel = {
    name: string
    description: string
    visibility: IVisibilityOptions
    ownerId: string
}

export type IConversationPreview = Omit<IConversation, "messages">
