import { IAccountModel } from "@/domain/models/account"
import {
    IAddConversationModel,
    IConversation,
} from "@/domain/models/conversation"
import { IMessage } from "@/domain/models/message"
import { ObjectId } from "mongodb"

export const makeFakeAddConversationModel = (
    override?: IAddConversationModel
): IAddConversationModel => {
    return Object.assign(
        {
            name: "any_name",
            description: "any_description",
            visibility: "public",
            ownerId: "any_owner_id",
        },
        override
    )
}

export const makeFakeConversation = (
    override?: Partial<IConversation>
): IConversation => {
    return Object.assign(
        {
            id: "1",
            createdAt: new Date().toISOString(),
            description: "any_description",
            invitationCode: 123,
            name: "any_conversation_name",
            ownerId: "2",
            userIds: ["1", "2", "3", "4", "5"],
            visibility: "public",
            messages: [
                {
                    content: "message 1",
                    conversationId: "any_conversation_id",
                    id: "any_id",
                    date: new Date().toISOString(),
                    senderId: "1",
                },
            ],
        },
        override
    )
}

export const makeFakeAccountModel = (
    override?: Partial<IAccountModel>
): IAccountModel => {
    return Object.assign(
        {
            id: "any_id",
            name: "any_name",
            email: "any_email@gmail.com",
            password: "any_hashed_password",
        },
        override
    )
}

export const makeFakeMessage = (
    overide?: Partial<IMessage> | { _id: ObjectId }
): IMessage => {
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
