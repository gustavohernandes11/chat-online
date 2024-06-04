import {
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"
import { IInvite } from "@/domain/models/invite"
import { IMessage } from "@/domain/models/message"

export const makeFakeConversationPreview = (
    override?: Partial<IConversationPreview>
): IConversationPreview => {
    return Object.assign(
        {
            id: "any_id",
            createdAt: new Date().toISOString(),
            description: "any_description",
            invitationCode: 123,
            name: "any_conversation_name",
            ownerId: "2",
            userIds: ["1", "2", "3", "4", "5"],
            visibility: "public",
        },
        override
    )
}

export const makeFakeConversation = (
    override?: Partial<IConversation>
): IConversation => {
    return Object.assign(
        {
            id: "any_id",
            createdAt: new Date().toISOString(),
            description: "any_description",
            invitationCode: 123,
            name: "any_conversation_name",
            ownerId: "2",
            userIds: ["1", "2", "3", "4", "5"],
            visibility: "public",
            messages: [],
        },
        override
    )
}

export const makeFakeMessage = (overide?: Partial<IMessage>): IMessage => {
    return Object.assign(
        {
            id: "any_id",
            conversationId: "1",
            senderId: "2",
            content: "any_content",
            date: new Date().toISOString(),
        },
        overide
    )
}

export const makeFakeInvite = (overide?: Partial<IInvite>): IInvite => {
    return Object.assign(
        {
            id: "any_id",
            conversationId: "1",
            userId: "2",
            status: "pending",
            createdAt: new Date().toISOString(),
        },
        overide
    )
}
