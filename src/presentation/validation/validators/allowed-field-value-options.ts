import { InvalidParamValue } from "@/presentation/errors";
import { IValidation } from "@/presentation/protocols";

export class AllowedFieldValueOptions implements IValidation {
	constructor(
		private readonly fieldName: string,
		private readonly options: string[]
	) {}

	validate(input: any) {
		for (let i = 0; i < this.options.length; i++) {
			if (input[this.fieldName] === this.options[i]) return;
		}
		return new InvalidParamValue(this.fieldName, this.options);
	}
}
