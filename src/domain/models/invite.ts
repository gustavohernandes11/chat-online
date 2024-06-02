import { IAccountId } from "./account"

export type IInviteStatus = "pending" | "declined" | "accepted"
export type IInvite = {
    id: string
    conversationId: string
    userId: IAccountId
    status: IInviteStatus
}
