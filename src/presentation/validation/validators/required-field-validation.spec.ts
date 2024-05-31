import { MissingParamError } from "@/presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("Required Field Validation", () => {
	it("should throw an missing param error if the required field is not provided", () => {
		const sut = new RequiredFieldValidation("name");

		const error = sut.validate({});

		expect(error).toEqual(new MissingParamError("name"));
	});
	it("should return nothing if the correct param is passed", () => {
		const sut = new RequiredFieldValidation("name");

		const response = sut.validate({ name: "any_name" });

		expect(response).toBeUndefined();
	});
});
