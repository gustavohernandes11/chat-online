import {
	RequiredFieldValidation,
	EmailValidation,
	ValidationComposite,
} from "@/presentation/validation/validators";
import { EmailValidateAdapter } from "../../adapters/email-validate-adapter";

export const makeLoginValidations = () => {
	const validations = [
		new RequiredFieldValidation("email"),
		new RequiredFieldValidation("password"),
		new EmailValidation("email", new EmailValidateAdapter()),
	];

	return new ValidationComposite(validations);
};
