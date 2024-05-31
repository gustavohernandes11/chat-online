import {
	RequiredFieldValidation,
	CompareFieldsValidation,
	EmailValidation,
	ValidationComposite,
} from "@/presentation/validation/validators";
import { EmailValidateAdapter } from "../../adapters/email-validate-adapter";

export const makeSignUpValidation = () => {
	const validations = [
		new RequiredFieldValidation("name"),
		new RequiredFieldValidation("email"),
		new RequiredFieldValidation("password"),
		new RequiredFieldValidation("passwordConfirmation"),
		new CompareFieldsValidation("password", "passwordConfirmation"),
		new EmailValidation("email", new EmailValidateAdapter()),
	];

	return new ValidationComposite(validations);
};
