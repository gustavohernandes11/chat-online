import { InvalidParamError } from "@/presentation/errors";
import { IEmailValidator } from "../protocols/email-validator";
import { EmailValidation } from "./email-validation";

class EmailValidatorStub implements IEmailValidator {
	isValid = (email: string): boolean => true;
}

interface SutTypes {
	sut: EmailValidation;
	emailValidator: EmailValidatorStub;
}

const makeSut = (): SutTypes => {
	const emailValidator = new EmailValidatorStub();
	const sut = new EmailValidation("email", emailValidator);
	return {
		sut,
		emailValidator,
	};
};

describe("Email Validation", () => {
	it("should call the isValid function of the EmailValidator", () => {
		const { sut, emailValidator } = makeSut();
		const validatorSpy = jest.spyOn(emailValidator, "isValid");

		sut.validate({
			email: "any_email@/gmail.com",
		});

		expect(validatorSpy).toHaveBeenCalled();
	});
	it("should return an invalid param error if the email is not valid", () => {
		const { sut, emailValidator } = makeSut();
		jest.spyOn(emailValidator, "isValid").mockReturnValueOnce(false);

		const error = sut.validate({
			email: "any_email@/gmail.com",
		});

		expect(error).toEqual(new InvalidParamError("email"));
	});
	it("should return nothing if the email is valid", () => {
		const { sut } = makeSut();

		const response = sut.validate({
			email: "any_email@/gmail.com",
		});

		expect(response).toBeUndefined();
	});
});
