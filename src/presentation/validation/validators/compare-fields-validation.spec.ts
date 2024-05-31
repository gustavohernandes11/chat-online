import { InvalidParamError } from "@/presentation/errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

describe("Compare Fields Validation", () => {
	it("should throw an invalid param error if the fields is not equal", () => {
		const sut = new CompareFieldsValidation(
			"password",
			"passwordConfirmation"
		);

		const error = sut.validate({
			password: "any_password",
			passwordConfirmation: "DIFFERENT_PASSWORD",
		});

		expect(error).toEqual(new InvalidParamError("passwordConfirmation"));
	});
	it("should return nothing if the fields is equal", () => {
		const sut = new CompareFieldsValidation(
			"password",
			"passwordConfirmation"
		);

		const response = sut.validate({
			password: "any_password",
			passwordConfirmation: "any_password",
		});

		expect(response).toBeUndefined();
	});
});
