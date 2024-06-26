import { AccountMongoRepository } from "@/infra/repositories/account-mongo-repository"
import { BcryptAdapter } from "@/infra/repositories/bcrypt-adapter"
import { JwtAdapter } from "@/infra/repositories/jwt-adapter"
import { AuthServices } from "@/infra/services/auth-services"
import { LoginController } from "@/presentation/controllers/account/login-controller"
import { IController } from "@/presentation/protocols"
import env from "../../config/env"
import { makeLoginValidations } from "../validation/make-login-validation"

export const makeLoginController = (): IController => {
    const validation = makeLoginValidations()
    const accountMongoRepository = new AccountMongoRepository()
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const dbAuthentication = new AuthServices(
        accountMongoRepository,
        jwtAdapter,
        bcryptAdapter
    )

    return new LoginController(validation, dbAuthentication)
}
