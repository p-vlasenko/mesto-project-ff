import {
    makeGetRequestParams,
    makePatchRequestParamsFactory,
    parseSuccessfulResponse,
} from './utils.js';

/** @typedef {import('../types.js').User} User */
/** @typedef {import('../types.js').UpdateUserParams} UpdateUserParams */
/** @typedef {import('./config.js').ApiConfig} ApiConfig */

/**
 * @typedef {object} UserApi
 * @property {() => Promise<User>} getUser
 * @property {(params: UpdateUserParams) => Promise<User>} updateUser
 * @property {(url: string) => Promise<string>} updateAvatar
 */

/** @type {(config: ApiConfig) => UserApi} */
const makeUserApi = ({ baseUrl, authToken }) => {
    const makePatchRequestParams = makePatchRequestParamsFactory(authToken);

    /** @type {UserApi['getUser']} */
    const getUser = () =>
        fetch(
            `${baseUrl}/users/me`,
            makeGetRequestParams(authToken),
        ).then(
            parseSuccessfulResponse(status => `GET user request returns not ok status: ${status}`),
        );

    /** @type {UserApi['updateUser']} */
    const updateUser = params =>
        fetch(
            `${baseUrl}/users/me`,
            makePatchRequestParams(params),
        ).then(
            parseSuccessfulResponse(status => `PATCH user request returns not ok status: ${status}`),
        );

    /** @type {UserApi['updateUser']} */
    const updateAvatar = url =>
        fetch(
            `${baseUrl}/users/me/avatar`,
            makePatchRequestParams({ avatar: url }),
        ).then(
            parseSuccessfulResponse(status => `PATCH avatar request returns not ok status: ${status}`),
        ).then(
            user => user.avatar,
        );

    return { getUser, updateUser, updateAvatar };
};

export {
    makeUserApi,
};
