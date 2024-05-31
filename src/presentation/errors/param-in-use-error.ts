export class ParamInUseError extends Error {
	constructor(param: string) {
		super(`${param.toUpperCase()} is alread in use`);
		this.name = "ParamInUseError";
	}
}
