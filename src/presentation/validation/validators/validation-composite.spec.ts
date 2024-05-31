import { MissingParamError } from "@/presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";
import { ValidationComposite } from "./validation-composite";

describe("Validation Composite", () => {
	it("should return nothing if pass all the validations ", () => {
		const validations = [
			new RequiredFieldValidation("name"),
			new RequiredFieldValidation("email"),
			new RequiredFieldValidation("password"),
		];
		const sut = new ValidationComposite(validations);

		const response = sut.validate({
			name: "any_name",
			email: "any_email",
			password: "any_password",
		});

		expect(response).toBeUndefined();
	});
	it("should return the correct error if any validation throws", () => {
		const validations = [
			new RequiredFieldValidation("name"),
			new RequiredFieldValidation("email"),
			new RequiredFieldValidation("password"),
		];
		const sut = new ValidationComposite(validations);

		const response = sut.validate({
			name: "any_name",
			email: "any_email",
		});

		expect(response).toEqual(new MissingParamError("password"));
	});
	it("should return only the first error if more than one validation fails", () => {
		const validations = [
			new RequiredFieldValidation("name"),
			new RequiredFieldValidation("email"),
			new RequiredFieldValidation("password"),
		];
		const sut = new ValidationComposite(validations);
		const compositeSpy = jest.spyOn(sut, "validate");

		const response = sut.validate({
			name: "any_name",
		});

		expect(response).toEqual(new MissingParamError("email"));
		expect(compositeSpy).toHaveLastReturnedWith(
			new MissingParamError("email")
		);
		expect(compositeSpy).not.toHaveLastReturnedWith(
			new MissingParamError("password")
		);
	});
});
