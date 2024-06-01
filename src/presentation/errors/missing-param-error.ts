export class MissingParamError extends Error {
    constructor(param: string) {
        super(`The field "${param}" is required`)
        this.name = "MissingParamError"
    }
}
