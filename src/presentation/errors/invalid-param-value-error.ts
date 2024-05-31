export class InvalidParamValue extends Error {
	constructor(param: string, allowedValues: string[]) {
		super(
			`The param ${param} should have only one of these values: ${allowedValues.join(
				" ,"
			)}`
		);
		this.name = "InvalidParamValueError";
	}
}
