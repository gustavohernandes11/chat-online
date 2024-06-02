import { IAccountId } from "./account"
import { IMessage } from "./message"

export type IVisibilityOptions = "public" | "private"
export type IConversation = {
    id: string
    name: string
    description: string
    messages: IMessage[]
    userIds: IAccountId[]
    createdAt: string
    visibility: IVisibilityOptions
    invitationCode: number
}

export type IAddConversationModel = {
    name: string
    description: string
    visibility: IVisibilityOptions
}

export type IConversationPreview = Omit<IConversation, "messages">
