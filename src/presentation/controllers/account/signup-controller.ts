import { IAuthService } from "@/domain/services-interfaces/auth-service";
import { EmailInUseError } from "../../errors/email-in-use-error";
import {
	badRequest,
	forbidden,
	ok,
	serverError,
} from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";

export class SigunUpController implements IController {
	constructor(
		private readonly validation: IValidation,
		private readonly authenticationService: IAuthService
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(request.body);
			if (error) return badRequest(error);

			const { email, name, password } = request.body;

			const isValid = await this.authenticationService.register({
				email,
				name,
				password,
			});

			if (!isValid) return forbidden(new EmailInUseError());
			const authResult = await this.authenticationService.auth({
				email,
				password,
			});

			return ok(authResult);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
