import {
    IAuthenticationModel,
    IAuthenticationResult,
} from "@/domain/models/authentication"
import { IAuth } from "@/domain/services-interfaces/auth-service"
import { makeLoginValidations } from "@/main/factories/validation/make-login-validation"
import { IHttpRequest } from "@/presentation/protocols"
import { MissingParamError } from "../../errors"
import { LoginController } from "./login-controller"

export const mockLoginRequest = (bodyOverride?: any): IHttpRequest => {
    return {
        body: Object.assign(
            {
                email: "valid_email@gmail.com",
                password: "valid_password",
            },
            bodyOverride || {}
        ),
    }
}

describe("Login", () => {
    class DbAuthenticationStub implements IAuth {
        auth(account: IAuthenticationModel): Promise<IAuthenticationResult> {
            return new Promise(resolve =>
                resolve({
                    accessToken: "valid_acess_token",
                    email: "valid_email",
                })
            )
        }
    }
    interface ISutTypes {
        sut: LoginController
        authenticationStub: IAuth
    }
    const makeSut = (): ISutTypes => {
        const loginValidations = makeLoginValidations()
        const authenticationStub = new DbAuthenticationStub()
        const sut = new LoginController(loginValidations, authenticationStub)
        return { sut, authenticationStub }
    }

    describe("Validations", () => {
        it("should return 400 when no email is provided", async () => {
            const { sut } = makeSut()
            const response = await sut.handle(mockLoginRequest({ email: null }))
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new MissingParamError("email"))
        })
        it("should return 400 when no password is provided", async () => {
            const { sut } = makeSut()
            const response = await sut.handle(
                mockLoginRequest({ password: null })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new MissingParamError("password"))
        })
    })
    describe("Authentication", () => {
        it("should call the authentication method with the correct params", async () => {
            const { sut, authenticationStub } = makeSut()
            const authSpy = jest.spyOn(authenticationStub, "auth")

            await sut.handle(mockLoginRequest())

            expect(authSpy).toHaveBeenCalledTimes(1)
            expect(authSpy).toHaveBeenCalledWith({
                email: "valid_email@gmail.com",
                password: "valid_password",
            })
        })
        it("should return 500 if authentication throws", async () => {
            const { sut, authenticationStub } = makeSut()
            jest.spyOn(authenticationStub, "auth").mockImplementationOnce(
                (): never => {
                    throw new Error()
                }
            )
            const result = await sut.handle(mockLoginRequest())
            expect(result.statusCode).toBe(500)
        })
        it("should return 401 if authentication return null", async () => {
            const { sut, authenticationStub } = makeSut()
            jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
                new Promise(resolve => resolve(null))
            )
            const result = await sut.handle(mockLoginRequest())
            expect(result.statusCode).toBe(401)
        })
        it("should return 200 with accessToken and name params in the body on success", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(mockLoginRequest())

            expect(response.body).toEqual({
                accessToken: "valid_acess_token",
                email: "valid_email",
            })
            expect(response.statusCode).toBe(200)
        })
    })
})
