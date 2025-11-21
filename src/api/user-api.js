import { HEADERS, CONTENT_TYPE, HTTP_METHOD } from './constants.js';

/** @typedef {import('../types.js').User} User */
/** @typedef {import('../types.js').UpdateUserParams} UpdateUserParams */

/**
 * @typedef {object} UserApiParams
 * @property {string} baseUrl
 * @property {string} authToken
 */

/**
 * @typedef {object} UserApi
 * @property {() => Promise<User>} getUser
 * @property {(params: UpdateUserParams) => Promise<User>} updateUser
 */

/** @type {(params: UserApiParams) => UserApi} */
const makeUserApi = ({ baseUrl, authToken }) => {
    /** @type {UserApi['getUser']} */
    const getUser = () => {
        return fetch(`${baseUrl}/users/me`, {
            method: HTTP_METHOD.GET,
            headers: {
                [HEADERS.AUTH]: authToken,
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                return Promise.reject(new Error('GET me request returns not ok status:', res.statusCode));
            }
        }).catch(err => void console.error(err));
    };

    /** @type {UserApi['updateUser']} */
    const updateUser = params => {
        return fetch(`${baseUrl}/users/me`, {
            method: HTTP_METHOD.PATCH,
            headers: {
                [HEADERS.AUTH]: authToken,
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
            },
            body: JSON.stringify(params),
        }).then(res => res.ok
            ? res.json()
            : Promise.reject(new Error('GET me request returns not ok status:', res.statusCode)),
        ).catch(err => void console.error(err));
    };

    return {
        getUser,
        updateUser,
    };
};

export {
    makeUserApi,
};
