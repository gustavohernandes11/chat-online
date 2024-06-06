import {
    IAccountModel,
    IAddAccountModel,
    IAuthenticatedAccountInfo,
} from "@/domain/models/account"
import { IAccountRepository } from "@/domain/repositories-interfaces/account-repository"
import { ObjectId } from "mongodb"
import { MongoHelper } from "../utils/mongo-helper"
import { parseToObjectId } from "../utils/parse-to-object-id"

export class AccountMongoRepository implements IAccountRepository {
    constructor() {}
    async checkByEmail(email: string): Promise<boolean> {
        const accountCollection = MongoHelper.getCollection("accounts")
        const account = await accountCollection.findOne(
            {
                email,
            },
            {
                projection: {
                    _id: 1,
                },
            }
        )
        return account !== null
    }

    async checkById(id: ObjectId | string): Promise<boolean> {
        const accountCollection = MongoHelper.getCollection("accounts")

        const account = await accountCollection.findOne({
            _id: parseToObjectId(id),
        })

        return account !== null
    }
    async addNewAccount(account: IAddAccountModel): Promise<boolean> {
        const accountCollection = MongoHelper.getCollection("accounts")
        const { acknowledged } =
            accountCollection && (await accountCollection.insertOne(account))

        return acknowledged
    }
    async getAccountByEmail(email: string): Promise<IAccountModel> {
        const accountCollection = MongoHelper.getCollection("accounts")
        const account = await accountCollection.findOne(
            {
                email,
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    password: 1,
                },
            }
        )
        return account && MongoHelper.map(account)
    }
    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = MongoHelper.getCollection("accounts")

        await accountCollection.updateOne(
            {
                _id: parseToObjectId(id),
            },
            {
                $set: {
                    accessToken: token,
                },
            }
        )
    }

    async getAccountByToken(
        token: string,
        role?: string | undefined
    ): Promise<IAuthenticatedAccountInfo | null> {
        const accountCollection = MongoHelper.getCollection("accounts")
        const account = await accountCollection.findOne(
            {
                accessToken: token,
                $or: [{ role }, { role: "admin" }],
            },
            {
                projection: {
                    _id: 1,
                },
            }
        )
        return account && MongoHelper.map(account)
    }
}
