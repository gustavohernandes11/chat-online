import { MissingParamError } from "@/presentation/errors";
import { IValidation } from "@/presentation/protocols";

export class RequiredFieldValidation implements IValidation {
	constructor(private readonly field: string) {}

	validate(input: any): any {
		if (!input[this.field]) return new MissingParamError(this.field);
	}
}
