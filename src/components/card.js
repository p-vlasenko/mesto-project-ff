import {
    cloneTemplateContent,
    getFirstElementByClassNameOrFail,
    makeStrictTemplateElementGetter,
    setImageAttributes,
    setText,
} from '../utils/dom.utils.js';
import { flow, passthrough } from '../utils/utils.js';

/**
 * @typedef {object} Card
 * @property {string} name
 * @property {string} link
 */

/** @type {Card[]} */
export const initialCards = [
    {
        name: 'Архыз',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg',
    },
    {
        name: 'Челябинская область',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg',
    },
    {
        name: 'Иваново',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg',
    },
    {
        name: 'Камчатка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg',
    },
    {
        name: 'Холмогорский район',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg',
    },
    {
        name: 'Байкал',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg',
    },
];

const getCardTemplate = makeStrictTemplateElementGetter('card-template', document);

/** @type {() => HTMLElement} */
const getCardImageElement = cardElement => getFirstElementByClassNameOrFail('card__image', cardElement);

/** @type {(cardElement: HTMLElement) => HTMLElement} */
const getCardTitleElement = cardElement => getFirstElementByClassNameOrFail('card__title', cardElement);

/** @type {(card: Card) => (cardElement: HTMLElement) => void} */
const setCardImageAttributes = ({ name, link }) => flow(
    getCardImageElement,
    setImageAttributes({ src: link, alt: name }),
);

/** @type {(title: string) => (cardElement: HTMLElement) => void} */
const setCardTitle = title => flow(getCardTitleElement, setText(title));

/** @type {(card: Card) => HTMLElement} */
export const makeCardElement = card => flow(
    getCardTemplate,
    cloneTemplateContent,
    passthrough(setCardImageAttributes(card)),
    passthrough(setCardTitle(card.name)),
)();
