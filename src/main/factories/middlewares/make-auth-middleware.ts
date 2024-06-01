import { AccountMongoRepository } from "@/infra/repositories/account-mongo-repository"
import { AuthMiddleware } from "@/presentation/middlewares/auth-middleware"

export const makeAuthMiddleware = (role?: string) => {
    return new AuthMiddleware(new AccountMongoRepository(), role)
}
