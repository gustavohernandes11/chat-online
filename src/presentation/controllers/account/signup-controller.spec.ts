import { makeSignUpValidation } from "@/main/factories/validation/make-signup-validation"
import {
    EmailInUseError,
    InvalidParamError,
    MissingParamError,
} from "../../errors"
import { IHttpRequest } from "../../protocols"
import { SigunUpController } from "./signup-controller"

import { IAddAccountModel } from "@/domain/models/account"
import {
    IAuthenticationModel,
    IAuthenticationResult,
} from "@/domain/models/authentication"
import { IAuthServices } from "@/domain/services-interfaces/auth-services"

const mockSignupRequest = (bodyOverride?: any): IHttpRequest => {
    return {
        body: Object.assign(
            {
                name: "valid_name",
                email: "valid_email@gmail.com",
                password: "valid_password",
                passwordConfirmation: "valid_password",
            },
            bodyOverride || {}
        ),
    }
}
describe("Signup Controller", () => {
    class AuthenticationServiceStub implements IAuthServices {
        async register(account: IAddAccountModel): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
        auth(account: IAuthenticationModel): Promise<IAuthenticationResult> {
            return new Promise(resolve =>
                resolve({
                    accessToken: "valid_access_token",
                    email: "valid_email",
                })
            )
        }
    }
    interface ISutTypes {
        sut: SigunUpController
        authenticationServiceStub: AuthenticationServiceStub
    }
    const makeSut = (): ISutTypes => {
        const signupValidations = makeSignUpValidation()
        const authenticationServiceStub = new AuthenticationServiceStub()
        const sut = new SigunUpController(
            signupValidations,
            authenticationServiceStub
        )
        return { sut, authenticationServiceStub }
    }

    describe("Validation", () => {
        it("should return 400 if name is not provided", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(
                mockSignupRequest({ name: undefined })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new MissingParamError("name"))
        })
        it("should return 400 if email is not provided", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(
                mockSignupRequest({ email: undefined })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new MissingParamError("email"))
        })
        it("should return 400 if password is not provided", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(
                mockSignupRequest({ password: undefined })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new MissingParamError("password"))
        })
        it("should return 400 if passwordConfirmation is not provided", async () => {
            const { sut } = makeSut()
            const response = await sut.handle(
                mockSignupRequest({ passwordConfirmation: undefined })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(
                new MissingParamError("passwordConfirmation")
            )
        })
        it("should return 400 if the passwordConfirmation is not equal to the password", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(
                mockSignupRequest({
                    passwordConfirmation: "DIFFERENT_PASSWORD_CONFIRMATION",
                })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(
                new InvalidParamError("passwordConfirmation")
            )
        })
        it("should return 400 if the email provided is not valid", async () => {
            const { sut } = makeSut()

            const response = await sut.handle(
                mockSignupRequest({ email: "INVALID_EMAIL" })
            )
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(new InvalidParamError("email"))
        })
    })
    describe("authenticationService.register", () => {
        it("should call the authenticationService.register with correct params", () => {
            const { sut, authenticationServiceStub } = makeSut()
            const addSpy = jest.spyOn(authenticationServiceStub, "register")
            sut.handle(mockSignupRequest())
            expect(addSpy).toHaveBeenCalledTimes(1)
            expect(addSpy).toHaveBeenCalledWith({
                name: "valid_name",
                email: "valid_email@gmail.com",
                password: "valid_password",
            })
        })
        it("should return 500 if the authenticationService.register throws", async () => {
            const { sut, authenticationServiceStub } = makeSut()
            jest.spyOn(
                authenticationServiceStub,
                "register"
            ).mockImplementationOnce(() => {
                throw new Error()
            })
            const response = await sut.handle(mockSignupRequest())
            expect(response.statusCode).toBe(500)
        })
        it("should return 403 (forbidden) if the authenticationService.register failed to add an account", async () => {
            const { sut, authenticationServiceStub } = makeSut()
            jest.spyOn(
                authenticationServiceStub,
                "register"
            ).mockReturnValueOnce(new Promise(resolve => resolve(false)))
            const response = await sut.handle(mockSignupRequest())
            expect(response.statusCode).toBe(403)
            expect(response.body).toEqual(new EmailInUseError())
        })
        it("should return 200 if correct data is provided", async () => {
            const { sut } = makeSut()
            const response = await sut.handle(mockSignupRequest())
            expect(response.statusCode).toBe(200)
        })
    })
    describe("Authentication", () => {
        it("should return 500 if Authentication throws", async () => {
            const { sut, authenticationServiceStub } = makeSut()
            jest.spyOn(
                authenticationServiceStub,
                "auth"
            ).mockImplementationOnce(() => {
                throw new Error()
            })
            const response = await sut.handle(mockSignupRequest())
            expect(response.statusCode).toBe(500)
        })
        it("should call the correct authentication method", async () => {
            const { sut, authenticationServiceStub } = makeSut()
            const authSpy = jest.spyOn(authenticationServiceStub, "auth")
            await sut.handle(mockSignupRequest())

            expect(authSpy).toHaveBeenCalledWith({
                email: "valid_email@gmail.com",
                password: "valid_password",
            })
        })
        it("should return 200 with authentication (name and accessToken)", async () => {
            const { sut } = makeSut()
            const response = await sut.handle(mockSignupRequest())

            expect(response.body).toEqual({
                accessToken: "valid_access_token",
                email: "valid_email",
            })
            expect(response.statusCode).toBe(200)
        })
    })
})
