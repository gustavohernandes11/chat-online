import { IAccountModel } from "./account"

export type IMessage = {
    id: string
    date: string
    content: string
    sender: IAccountModel
    conversationId: string
}

export type INewMessage = {
    content: string
    sender: IAccountModel
    conversationId: string
}
