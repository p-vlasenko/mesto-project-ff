import { CONTENT_TYPE, HEADERS, HTTP_METHOD } from './constants.js';

/** @typedef {import('../types.js').Card} Card */

/**
 * @typedef {object} CardsApiParams
 * @property {string} baseUrl
 * @property {string} authToken
 */

const makeCardsApi = ({ baseUrl, authToken }) => {
    /** @type {() => Promise<Card[]>} */
    const getCards = () => {
        return fetch(`${baseUrl}/cards`, {
            method: HTTP_METHOD.GET,
            headers: {
                [HEADERS.AUTH]: authToken,
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                return Promise.reject(new Error('cards request returns not ok status:', res.statusCode));
            }
        }).catch(err => void console.error(err));
    };

    /** @type {(params: Pick<Card, 'name' | 'link'>) => Promise<Card>} */
    const addCard = ({ name, link }) => {
        return fetch(`${baseUrl}/cards`, {
            method: HTTP_METHOD.POST,
            headers: {
                [HEADERS.AUTH]: authToken,
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
            },
            body: JSON.stringify({ name, link }),
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                return Promise.reject(new Error('card adding request returns not ok status:', res.statusCode));
            }
        }).catch(err => void console.error(err));
    };

    /** @type {(id: Card['_id']) => Promise<void>} */
    const deleteCard = id => {
        return fetch(`${baseUrl}/cards/${id}`, {
            method: HTTP_METHOD.DELETE,
            headers: {
                [HEADERS.AUTH]: authToken,
            },
        }).then(res => {
            if (res.ok) {
                return;
            }
            else {
                return Promise.reject(new Error('card deletion request returns not ok status:', res.statusCode));
            }
        }).catch(err => void console.error(err));
    };

    /** @type {(id: Card['_id']) => Promise<number>} */
    const addCardLike = id => {
        return fetch(`${baseUrl}/cards/likes/${id}`, {
            method: HTTP_METHOD.PUT,
            headers: {
                [HEADERS.AUTH]: authToken,
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                return Promise.reject(new Error('card like adding request returns not ok status:', res.statusCode));
            }
        }).then(
            getLikesNumber,
        ).catch(err => void console.error(err));
    };

    /** @type {(id: Card['_id']) => Promise<number>} */
    const removeCardLike = id => {
        return fetch(`${baseUrl}/cards/likes/${id}`, {
            method: HTTP_METHOD.DELETE,
            headers: {
                [HEADERS.AUTH]: authToken,
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                return Promise.reject(new Error('card like removing request returns not ok status:', res.statusCode));
            }
        }).then(
            getLikesNumber,
        ).catch(err => void console.error(err));
    };

    return { getCards, addCard, deleteCard, addCardLike, removeCardLike };
};

/** @type {(card: Card) => number */
const getLikesNumber = card => card.likes.length;

export {
    makeCardsApi,
};
