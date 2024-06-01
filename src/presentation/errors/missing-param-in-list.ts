export class MissingParamInListError extends Error {
    constructor(params: string[]) {
        super(`At least one of this params is required: ${params.join(",")}`)
        this.name = "MissingParamInListError"
    }
}
