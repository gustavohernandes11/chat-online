export class InvalidDateFormatError extends Error {
	constructor(param: string) {
		super(`The data format should be in ISO8601: ${param}`);
		this.name = "InvalidDateFormatError";
	}
}
