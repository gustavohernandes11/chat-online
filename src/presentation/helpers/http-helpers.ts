import { IHttpResponse } from "../protocols"

export const badRequest = (error: Error): IHttpResponse => ({
    statusCode: 400,
    body: error,
})

export const unauthorized = (body: any = null): IHttpResponse => ({
    statusCode: 401,
    body,
})

export const serverError = (error?: Error): IHttpResponse => ({
    statusCode: 500,
    body: error,
})

export const forbidden = (error: Error): IHttpResponse => ({
    statusCode: 403,
    body: error,
})

export const notFound = (): IHttpResponse => ({
    statusCode: 404,
    body: null,
})

export const ok = (body: any = null): IHttpResponse => ({
    statusCode: 200,
    body,
})

export const noContent = (): IHttpResponse => ({
    statusCode: 204,
    body: null,
})
