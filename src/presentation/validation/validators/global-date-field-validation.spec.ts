import { InvalidDateFormatError } from "@/presentation/errors/invalid-date-format-error";
import { GlobalDateFormatValidation } from "./global-date-field-validation";
import { InvalidParamError } from "@/presentation/errors";

interface SutTypes {
	sut: GlobalDateFormatValidation;
}

const makeSut = (): SutTypes => {
	const sut = new GlobalDateFormatValidation("date");
	return {
		sut,
	};
};

describe("UtcDateValidation", () => {
	it("should return an invalid param error if the date field is not a string", () => {
		const { sut } = makeSut();
		const input = { date: 123 };

		const error = sut.validate(input);

		expect(error).toEqual(new InvalidParamError("date"));
	});
	it("should throw an InvalidDateFormatError if the date is not in ISO format", () => {
		const { sut } = makeSut();
		const input = { date: new Date().toUTCString() };

		const error = sut.validate(input);

		expect(error).toEqual(new InvalidDateFormatError("date"));
	});
	it("should return nothing if date is in ISO format", () => {
		const { sut } = makeSut();
		const input = { date: new Date().toISOString() };

		const error = sut.validate(input);

		expect(error).toBeUndefined();
	});
});
