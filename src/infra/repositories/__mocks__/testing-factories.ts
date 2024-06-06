import { IAddAccountModel } from "@/domain/models/account"
import { IAddConversationModel } from "@/domain/models/conversation"

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

export const makeFakeAccountModel = (
    override?: IAddAccountModel
): IAddAccountModel => {
    return Object.assign(
        {
            name: "any_name",
            email: "any_email@/gmail.com",
            password: "any_hashed_password",
        },
        override
    ) as IAddAccountModel
}
