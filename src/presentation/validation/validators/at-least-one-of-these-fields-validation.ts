import { MissingParamInListError } from "@/presentation/errors/missing-param-in-list";
import { IValidation } from "@/presentation/protocols";

export class AtLeastOneOfTheseFieldsValidation implements IValidation {
	constructor(private readonly fields: string[]) {}

	validate(input: any) {
		for (let i = 0; i < this.fields.length; i++) {
			if (input[this.fields[i]]) return;
		}
		return new MissingParamInListError(this.fields);
	}
}
