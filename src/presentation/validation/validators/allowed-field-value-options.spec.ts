import { AllowedFieldValueOptions } from "./allowed-field-value-options";
import { InvalidParamValue } from "@/presentation/errors";

describe("Allowed field value options", () => {
	it("It should return an error if the value is not in the options", () => {
		const options = ["A", "B"];
		const validation = new AllowedFieldValueOptions("FieldName", options);

		const response = validation.validate({ FieldName: "C" });

		expect(response).toEqual(new InvalidParamValue("FieldName", options));
	});
	it("It should return nothing is the value is in the options", () => {
		const options = ["A", "B"];
		const validation = new AllowedFieldValueOptions("FieldName", options);

		let response = validation.validate({ FieldName: "A" });
		expect(response).toBeUndefined();

		response = validation.validate({ FieldName: "B" });
		expect(response).toBeUndefined();
	});
});
