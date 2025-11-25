import { AUTH_TOKEN, BASE_URL } from './constants.js';
/**
 * @typedef {object} ApiConfig
 * @property {string} baseUrl
 * @property {string} authToken
 */

/** @type {ApiConfig} */
export const apiConfig = {
    baseUrl: BASE_URL,
    authToken: AUTH_TOKEN,
};
