export interface IAccountModel {
    id: string
    name: string
    email: string
    password: string
}

export type IAddAccountModel = {
    name: string
    email: string
    password: string
}

export type IAuthenticatedAccountInfo = { id: string }
