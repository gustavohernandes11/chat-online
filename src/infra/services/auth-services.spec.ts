import { IAccountModel, IAddAccountModel } from "@/domain/models/account"
import {
    IAddNewAccountRepository,
    IGetAccountByEmailRepository,
    IUpdateAccessTokenRepository,
} from "@/domain/repositories-interfaces/account-repository"
import { IEncrypter } from "@/domain/repositories-interfaces/encrypt-repository"
import {
    IHashComparer,
    IHashRepository,
} from "@/domain/repositories-interfaces/hash-repository"
import { IAuthServices } from "@/domain/services-interfaces/auth-services"
import { AuthServices } from "./auth-services"

class GetAccountByEmailRepositoryStub implements IGetAccountByEmailRepository {
    getAccountByEmail(email: string): Promise<IAccountModel | null> {
        return new Promise(resolve =>
            resolve({
                email: "any_email",
                id: "any_id",
                name: "any_name",
                password: "hashed_password",
            })
        )
    }
}

class AddNewAccountRepositoryStub implements IAddNewAccountRepository {
    addNewAccount(account: IAddAccountModel): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}

class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    async updateAccessToken(accountId: string, token: string): Promise<void> {}
}

class HashComparerStub implements IHashRepository {
    hash(text: string): Promise<string> {
        return new Promise(resolve => resolve("hashed_password"))
    }
    compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}

class EncrypterStub implements IEncrypter {
    encrypt(plaintext: string): Promise<string> {
        return new Promise(resolve => resolve("encrypted_text"))
    }
}

interface ISutType {
    sut: IAuthServices
    hashComparerStub: IHashComparer
    getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
    addNewAccountRepositoryStub: IAddNewAccountRepository
    encrypter: IEncrypter
    updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}

const makeSut = (): ISutType => {
    const hashComparerStub = new HashComparerStub()
    const getAccountByEmailRepositoryStub =
        new GetAccountByEmailRepositoryStub()
    const addNewAccountRepositoryStub = new AddNewAccountRepositoryStub()
    const encrypter = new EncrypterStub()
    const updateAccessTokenRepositoryStub =
        new UpdateAccessTokenRepositoryStub()

    const sut = new AuthServices(
        getAccountByEmailRepositoryStub,
        addNewAccountRepositoryStub,
        updateAccessTokenRepositoryStub,
        encrypter,
        hashComparerStub
    )

    return {
        sut,
        getAccountByEmailRepositoryStub,
        addNewAccountRepositoryStub,
        hashComparerStub,
        encrypter,
        updateAccessTokenRepositoryStub,
    }
}

describe("AuthServices", () => {
    describe("GetAccountByEmailRepository", () => {
        it("should call the correct getAccountByEmailRepository method", async () => {
            const { sut, getAccountByEmailRepositoryStub } = makeSut()
            const loadSpy = jest.spyOn(
                getAccountByEmailRepositoryStub,
                "getAccountByEmail"
            )

            await sut.auth({ email: "any_email", password: "any_password" })

            expect(loadSpy).toHaveBeenCalledTimes(1)
            expect(loadSpy).toHaveBeenCalledWith("any_email")
        })
        it("should return null if account wasn't found", async () => {
            const { sut, getAccountByEmailRepositoryStub } = makeSut()
            jest.spyOn(
                getAccountByEmailRepositoryStub,
                "getAccountByEmail"
            ).mockReturnValueOnce(new Promise(resolve => resolve(null)))

            const response = await sut.auth({
                email: "any_email",
                password: "any_password",
            })

            expect(response).toBeNull()
        })
        it("should throw if getAccountByEmailRepository throws", async () => {
            const { sut, getAccountByEmailRepositoryStub } = makeSut()
            jest.spyOn(
                getAccountByEmailRepositoryStub,
                "getAccountByEmail"
            ).mockImplementationOnce((): never => {
                throw new Error()
            })

            const promise = sut.auth({
                email: "any_email",
                password: "any_password",
            })
            expect(promise).rejects.toThrow()
        })
    })

    describe("AddNewAccountRepository", () => {
        it("should call addNewAccount with correct parameters", async () => {
            const {
                sut,
                addNewAccountRepositoryStub,
                getAccountByEmailRepositoryStub,
            } = makeSut()
            const addSpy = jest.spyOn(
                addNewAccountRepositoryStub,
                "addNewAccount"
            )
            jest.spyOn(
                getAccountByEmailRepositoryStub,
                "getAccountByEmail"
            ).mockImplementationOnce(() => Promise.resolve(null))

            await sut.register({
                email: "any_email",
                password: "any_password",
                name: "any_name",
            })

            expect(addSpy).toHaveBeenCalledWith({
                email: "any_email",
                password: "hashed_password",
                name: "any_name",
            })
        })
        it("should throw if addNewAccount throws", async () => {
            const {
                sut,
                addNewAccountRepositoryStub,
                getAccountByEmailRepositoryStub,
            } = makeSut()
            jest.spyOn(
                getAccountByEmailRepositoryStub,
                "getAccountByEmail"
            ).mockImplementationOnce(() => Promise.resolve(null))

            jest.spyOn(
                addNewAccountRepositoryStub,
                "addNewAccount"
            ).mockImplementationOnce((): never => {
                throw new Error()
            })

            const promise = sut.register({
                email: "any_email",
                password: "any_password",
                name: "any_name",
            })
            expect(promise).rejects.toThrow()
        })
    })

    describe("UpdateAccessTokenRepository", () => {
        it("should throw if updateAccessTokenRepositoryStub throws", async () => {
            const { sut, updateAccessTokenRepositoryStub } = makeSut()
            jest.spyOn(
                updateAccessTokenRepositoryStub,
                "updateAccessToken"
            ).mockImplementationOnce((): never => {
                throw new Error()
            })

            const promise = sut.auth({
                email: "any_email",
                password: "any_password",
            })
            expect(promise).rejects.toThrow()
        })
        it("should call updateAccessTokenRepositoryStub method when correct data is provided", async () => {
            const { sut, updateAccessTokenRepositoryStub } = makeSut()
            const updateTokenSpy = jest.spyOn(
                updateAccessTokenRepositoryStub,
                "updateAccessToken"
            )

            await sut.auth({ email: "any_email", password: "any_password" })

            expect(updateTokenSpy).toHaveBeenCalledTimes(1)
            expect(updateTokenSpy).toHaveBeenCalledWith(
                "any_id",
                "encrypted_text"
            )
        })
    })
    describe("auth", () => {
        it("it should return an accessToken when correct login data is provided", async () => {
            const { sut } = makeSut()

            const result = await sut.auth({
                email: "any_email",
                password: "any_password",
            })

            expect(result?.accessToken).toBe("encrypted_text")
            expect(result?.email).toBe("any_email")
        })
    })
})
