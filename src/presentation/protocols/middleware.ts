import { IHttpResponse } from "./http";

export interface Middleware<T = any> {
	handle: (httpRequest: T) => Promise<IHttpResponse>;
}
