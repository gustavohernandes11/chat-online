import { InvalidParamError } from "@/presentation/errors";
import { InvalidDateFormatError } from "@/presentation/errors/invalid-date-format-error";
import { IValidation } from "@/presentation/protocols";

export class GlobalDateFormatValidation implements IValidation {
	constructor(private readonly dateField: string) {}

	validate(input: any): any {
		const inputValue = input[this.dateField];
		if (!inputValue) return; // optional field

		if (typeof inputValue !== "string") {
			return new InvalidParamError(this.dateField);
		}
		const iso8601Pattern = new RegExp(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
		);

		if (!iso8601Pattern.test(inputValue))
			return new InvalidDateFormatError(this.dateField);
	}
}
