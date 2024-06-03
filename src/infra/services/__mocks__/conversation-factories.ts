import {
    IConversation,
    IConversationPreview,
} from "@/domain/models/conversation"

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
