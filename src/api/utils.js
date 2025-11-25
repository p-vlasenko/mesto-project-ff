// @ts-check
import { HEADERS, HTTP_METHOD, jsonContentHeader } from './constants.js';

/** @type {(authToken: string) => { [key: string]: string }} */
export const makeAuthHeader = authToken => ({
    [HEADERS.AUTH]: authToken,
});

/** @type {(makeMessage: (status: number) => string) => (resp: Response) => unknown} */
export const parseSuccessfulResponse = makeMessage => resp =>
    resp.ok
        ? resp.json()
        : Promise.reject(new Error(makeMessage(resp.status)));

/** @type {(authHeader: string) => (body: object) => RequestInit} */
export const makePatchRequestParamsFactory = authHeader => body => ({
    method: HTTP_METHOD.PATCH,
    headers: {
        ...makeAuthHeader(authHeader),
        ...jsonContentHeader,
    },
    body: JSON.stringify(body),
});

/** @type {(authHeader: string) => (body: object) => RequestInit} */
export const makePostRequestParamsFactory = authHeader => body => ({
    method: HTTP_METHOD.POST,
    headers: {
        ...makeAuthHeader(authHeader),
        ...jsonContentHeader,
    },
    body: JSON.stringify(body),
});

/** @type {(authHeader: string) => RequestInit} */
export const makeDeleteRequestParams = authHeader => ({
    method: HTTP_METHOD.DELETE,
    headers: makeAuthHeader(authHeader),
});

/** @type {(authHeader: string) => RequestInit} */
export const makePutRequestParams = authHeader => ({
    method: HTTP_METHOD.PUT,
    headers: makeAuthHeader(authHeader),
});

/** @type {(authHeader: string) => RequestInit} */
export const makeGetRequestParams = authToken => ({
    method: HTTP_METHOD.GET,
    headers: makeAuthHeader(authToken),
});
