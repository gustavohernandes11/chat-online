import { IMessage } from "./message"

export type IConversation = {
    id: string
    messages: IMessage[]
    createdAt: string
}
