import { IAuth } from "@/domain/services-interfaces/auth-service";
import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";

export class LoginController implements IController {
	constructor(
		private readonly validation: IValidation,
		private readonly authenticationService: IAuth
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(request.body);
			if (error) return badRequest(error);

			const { email, password } = request.body;

			const authResult = await this.authenticationService.auth({
				email,
				password,
			});

			if (!authResult) return unauthorized();

			return ok(authResult);
		} catch (error) {
			return serverError();
		}
	}
}
