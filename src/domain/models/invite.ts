export type IInviteStatus = "pending" | "declined" | "accepted"

export type IInvite = {
    id: string
    conversationId: string
    userId: string
    status: IInviteStatus
    createdAt: string
}

export type IAddInvitationModel = {
    conversationId: string
    userId: string
    status: IInviteStatus
    createdAt: string
}
