import { Collection } from "mongodb"
import { MongoHelper } from "../utils/mongo-helper"
import { makeFakeAccountModel } from "./__mocks__/repository-testing-factories"
import { AccountMongoRepository } from "./account-mongo-repository"

describe("Account Mongo Repository", () => {
    let accountCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(
            process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat-backend"
        )
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = MongoHelper.getCollection("accounts")
        await accountCollection.deleteMany({})
    })

    type ISutTypes = {
        sut: AccountMongoRepository
    }

    const makeSut = (): ISutTypes => {
        return { sut: new AccountMongoRepository() }
    }

    describe("add()", () => {
        it("should return true if the account is added", async () => {
            const { sut } = makeSut()
            const sucess = await sut.addNewAccount(makeFakeAccountModel())
            expect(sucess).toBe(true)
        })
    })
    describe("getAccountByEmail()", () => {
        it("should load the correct account by email", async () => {
            const { sut } = makeSut()
            await sut.addNewAccount(
                makeFakeAccountModel({ email: "johndoe@gmail.com" })
            )

            const account = await sut.getAccountByEmail("johndoe@gmail.com")

            expect(account).not.toBeNull()
            expect(account?.id).toBeTruthy()
            expect(account?.name).toBe("any_name")
            expect(account?.password).toBe("any_hashed_password")
        })
        it("should return null if the account do not exists", async () => {
            const { sut } = makeSut()
            const account = await sut.getAccountByEmail("any_email@gmail.com")
            expect(account).toBeNull()
        })
    })
    describe("updateAccessToken()", () => {
        it("should set or update the accessToken in the database", async () => {
            const { sut } = makeSut()
            const { insertedId } = await accountCollection.insertOne(
                makeFakeAccountModel()
            )
            const fakeAccount = await accountCollection.findOne({
                _id: insertedId,
            })

            expect(fakeAccount?.accessToken).toBeFalsy()

            const accessToken = "any_token"
            await sut.updateAccessToken(insertedId.toHexString(), accessToken)

            const account = await accountCollection.findOne({
                _id: insertedId,
            })
            expect(account).toBeTruthy()
            expect(account!.accessToken).toBeTruthy()
            expect(account!.accessToken).toBe(accessToken)
        })
    })
    describe("checkByEmail()", () => {
        it("should return false if the account do not exists", async () => {
            const { sut } = makeSut()
            const response = await sut.checkByEmail(
                "non_existent_email@gmail.com"
            )
            expect(response).toBe(false)
        })
        it("should return true if the account exists", async () => {
            const { sut } = makeSut()
            await sut.addNewAccount(
                makeFakeAccountModel({
                    email: "any_email@gmail.com",
                })
            )
            const response = await sut.checkByEmail("any_email@gmail.com")
            expect(response).toBe(true)
        })
    })
    describe("checkById()", () => {
        it("should return false if the account do not exists", async () => {
            const { sut } = makeSut()
            const response = await sut.checkById("NON_EXISTENT_id")
            expect(response).toBe(false)
        })
        it("should return true if the account exists", async () => {
            const { sut } = makeSut()
            const { insertedId } = await accountCollection.insertOne(
                makeFakeAccountModel()
            )

            const response = await sut.checkById(insertedId.toHexString())
            expect(response).toBe(true)
        })
        it("should work with a string as id", async () => {
            const { sut } = makeSut()
            const { insertedId } = await accountCollection.insertOne(
                makeFakeAccountModel()
            )

            const response = await sut.checkById(insertedId.toHexString())
            expect(response).toBeTruthy()
        })
    })
    describe("getAccountByToken()", () => {
        beforeEach(() => {})
        it("should load the correct account from token without role", async () => {
            const { sut } = makeSut()

            const { insertedId } = await accountCollection.insertOne(
                makeFakeAccountModel({ accessToken: "any_access_token" })
            )
            const response = await sut.getAccountByToken("any_access_token")

            expect(response!.id).toBeTruthy()
            expect(response!.id).toEqual(insertedId.toHexString())
        })
        it("should load the correct account with role", async () => {
            const { sut } = makeSut()

            const { insertedId } = await accountCollection.insertOne(
                makeFakeAccountModel({
                    accessToken: "any_access_token",
                    role: ["admin"],
                })
            )
            const account = await sut.getAccountByToken(
                "any_access_token",
                "admin"
            )
            expect(account!.id).toEqual(insertedId.toHexString())
        })
        it("should return null if the role is not correct", async () => {
            const { sut } = makeSut()

            await accountCollection.insertOne(
                makeFakeAccountModel({
                    accessToken: "any_access_token",
                    role: undefined,
                })
            )
            const account = await sut.getAccountByToken(
                "any_access_token",
                "admin"
            )
            expect(account).toBeNull()
        })
        it("should return the account even if the role is not provided when it's an admin", async () => {
            const { sut } = makeSut()

            await accountCollection.insertOne(
                makeFakeAccountModel({
                    accessToken: "any_access_token",
                    role: ["admin"],
                })
            )
            const account = await sut.getAccountByToken("any_access_token")
            expect(account).toBeTruthy()
        })
        it("should return null if the accessToken is invalid", async () => {
            const { sut } = makeSut()

            await accountCollection.insertOne(
                makeFakeAccountModel({
                    accessToken: "any_access_token",
                    role: ["admin"],
                })
            )
            const account = await sut.getAccountByToken("INVALID_access_token")
            expect(account).toBeNull()
        })

        it("should return null if the account do not exists", async () => {
            const { sut } = makeSut()
            const account = await sut.getAccountByToken("any_access_token")
            expect(account).toBeNull()
        })
    })
})
