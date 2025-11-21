const COHORT_ID = 'higher-front-back-dev';

export const AUTH_TOKEN = 'e157e78d-13db-4e7e-9ca6-c6bca52db205';
export const BASE_URL = `https://nomoreparties.co/v1/${COHORT_ID}`;

export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

export const HEADERS = {
    AUTH: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
};

export const CONTENT_TYPE = {
    JSON: 'application/json',
};

/**
 * @typedef {object} User
 * @property {string} name
 * @property {string} about
 * @property {string} avatar
 * @property {string} _id
 * @property {string} cohort
 */
