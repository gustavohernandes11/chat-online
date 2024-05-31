import { MissingParamInListError } from "@/presentation/errors/missing-param-in-list";
import { AtLeastOneOfTheseFieldsValidation } from "./at-least-one-of-these-fields-validation";

describe("At Least One Of These Fields Validation", () => {
	it("should return nothing when has at least one of the options", () => {
		const options = ["a", "b", "c"];
		const validation = new AtLeastOneOfTheseFieldsValidation(options);

		let result = validation.validate({
			a: "any_value",
		});
		expect(result).toBeUndefined();

		result = validation.validate({
			b: "any_value",
		});
		expect(result).toBeUndefined();

		result = validation.validate({
			c: "any_value",
		});
		expect(result).toBeUndefined();

		result = validation.validate({
			a: "any_value",
			b: "any_value",
			c: "any_value",
		});
		expect(result).toBeUndefined();
	});
	it("should throw an error when none of the fields exists", () => {
		const options = ["a", "b", "c"];

		const validation = new AtLeastOneOfTheseFieldsValidation(options);

		let error = validation.validate({});
		expect(error).toEqual(new MissingParamInListError(options));

		error = validation.validate({ d: "any_value" });
		expect(error).toEqual(new MissingParamInListError(options));
	});
});
