import { BcryptAdapter } from "@/infra/repositories/bcrypt-adapter";
import { JwtAdapter } from "@/infra/repositories/jwt-adapter";
import { AccountMongoRepository } from "@/infra/repositories/account-mongo-repository";
import { LoginController } from "@/presentation/controllers/account/login-controller";
import { IController } from "@/presentation/protocols";
import { AuthService } from "@/infra/services/auth-service";
import env from "../../config/env";
import { makeLoginValidations } from "../validation/make-login-validation";

export const makeLoginController = (): IController => {
	const validation = makeLoginValidations();
	const accountMongoRepository = new AccountMongoRepository();
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const dbAuthentication = new AuthService(
		accountMongoRepository,
		accountMongoRepository,
		accountMongoRepository,
		jwtAdapter,
		bcryptAdapter
	);

	return new LoginController(validation, dbAuthentication);
};
