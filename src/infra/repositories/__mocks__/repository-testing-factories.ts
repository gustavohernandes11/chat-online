import { IAccountModel } from "@/domain/models/account"
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
