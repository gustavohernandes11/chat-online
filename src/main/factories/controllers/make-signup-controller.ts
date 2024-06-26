import { AccountMongoRepository } from "@/infra/repositories/account-mongo-repository"
import { BcryptAdapter } from "@/infra/repositories/bcrypt-adapter"
import { JwtAdapter } from "@/infra/repositories/jwt-adapter"
import { AuthServices } from "@/infra/services/auth-services"
import { SigunUpController } from "@/presentation/controllers/account/signup-controller"
import { IController } from "@/presentation/protocols"
import env from "../../config/env"
import { makeSignUpValidation } from "../validation/make-signup-validation"

export const makeSignupController = (): IController => {
    const validations = makeSignUpValidation()
    const accountMongoRepoisitory = new AccountMongoRepository()
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const authenticationService = new AuthServices(
        accountMongoRepoisitory,
        jwtAdapter,
        bcryptAdapter
    )

    return new SigunUpController(validations, authenticationService)
}
