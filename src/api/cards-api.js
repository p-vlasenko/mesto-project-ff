import {
    makeDeleteRequestParams,
    makeGetRequestParams,
    makePostRequestParamsFactory,
    makePutRequestParams,
    parseSuccessfulResponse,
} from './utils.js';

/** @typedef {import('../types.js').Card} Card */

/**
 * @typedef {object} CardsApiParams
 * @property {string} baseUrl
 * @property {string} authToken
 */

/**
 * @typedef {object} CardsApi
 * @property {() => Promise<Card[]>} getCards
 * @property {(params: Pick<Card, 'name' | 'link'>) => Promise<Card>} addCard
 * @property {(id: Card['_id']) => Promise<string>} deleteCard
 * @property {(id: Card['_id']) => Promise<number>} addCardLike
 * @property {(id: Card['_id']) => Promise<number>} removeCardLike
 */

/** @type {(params: CardsApiParams) => CardsApi} */
const makeCardsApi = ({ baseUrl, authToken }) => {
    const makePostRequestParams = makePostRequestParamsFactory(authToken);

    /** @type {() => Promise<Card[]>} */
    const getCards = () =>
        fetch(
            `${baseUrl}/cards`,
            makeGetRequestParams(authToken),
        ).then(parseSuccessfulResponse(status => `cards request returns not ok status: ${status}`));

    /** @type {(params: Pick<Card, 'name' | 'link'>) => Promise<Card>} */
    const addCard = ({ name, link }) =>
        fetch(
            `${baseUrl}/cards`,
            makePostRequestParams({ name, link }),
        ).then(
            parseSuccessfulResponse(status => `card adding request returns not ok status: ${status}`),
        );

    /** @type {(id: Card['_id']) => Promise<string>} */
    const deleteCard = id =>
        fetch(
            `${baseUrl}/cards/${id}`,
            makeDeleteRequestParams(authToken),
        ).then(
            parseSuccessfulResponse(status => `card deletion request returns not ok status: ${status}`),
        );

    /** @type {(id: Card['_id']) => Promise<number>} */
    const addCardLike = id =>
        fetch(
            `${baseUrl}/cards/likes/${id}`,
            makePutRequestParams(authToken),
        ).then(
            parseSuccessfulResponse(status => `card like adding request returns not ok status: ${status}`),
        ).then(getLikesNumber);

    /** @type {(id: Card['_id']) => Promise<number>} */
    const removeCardLike = id =>
        fetch(
            `${baseUrl}/cards/likes/${id}`,
            makeDeleteRequestParams(authToken),
        ).then(
            parseSuccessfulResponse(status => `card like removing request returns not ok status: ${status}`),
        ).then(getLikesNumber);

    return { getCards, addCard, deleteCard, addCardLike, removeCardLike };
};

/** @type {(card: Card) => number} */
const getLikesNumber = card => card.likes.length;

export {
    makeCardsApi,
};
