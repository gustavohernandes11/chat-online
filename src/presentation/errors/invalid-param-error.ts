export class InvalidParamError extends Error {
	constructor(param: string) {
		super(`The field "${param}" is invalid`);
		this.name = "InvalidParamError";
	}
}
