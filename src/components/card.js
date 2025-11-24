import {
    cloneTemplateContent,
    getFirstChild,
    getFirstElementByClassNameOrFail,
    makeStrictTemplateElementGetter,
    setImageAttributes,
    setText,
} from '../utils/dom.utils.js';
import { flow, passthrough, when } from '../utils/utils.js';

/** @typedef {import('../types.js').Card} Card */
/** @typedef {import('../types.js').User} User */

const getCardTemplate = makeStrictTemplateElementGetter('card-template', document);

/** @type {() => HTMLElement} */
const getCardImageElement = cardElement => getFirstElementByClassNameOrFail('card__image', cardElement);

/** @type {(cardElement: HTMLElement) => HTMLElement} */
const getCardTitleElement = cardElement => getFirstElementByClassNameOrFail('card__title', cardElement);

/** @type {(cardElement: HTMLElement) => HTMLElement} */
export const getCardLikeNumberElement = cardElement =>
    getFirstElementByClassNameOrFail('card__like-count', cardElement);

/** @type {(cardElement: HTMLElement) => HTMLElement} */
const getDeleteCardButton = cardElement => getFirstElementByClassNameOrFail('card__delete-button', cardElement);

/** @type {(cardElement: HTMLElement) => HTMLElement} */
const getCardLikeButton = cardElement => getFirstElementByClassNameOrFail('card__like-button', cardElement);

/** @type {(card: Card) => (cardElement: HTMLElement) => void} */
const setCardImageAttributes = ({ name, link }) => flow(
    getCardImageElement,
    setImageAttributes({ src: link, alt: name }),
);

/** @type {(title: string) => (cardElement: HTMLElement) => void} */
const setCardTitle = title => flow(getCardTitleElement, setText(title));

/** @type {(num: number) => (cardElement: HTMLElement) => void} */
const setCardLikeNumber = num => flow(getCardLikeNumberElement, setText(num.toString()));

/** @type {(id: string) => (cardElement: HTMLElement) => void} */
const setCardId = id => cardElement => void (cardElement.dataset.id = id);

/** @type {(button: HTMLElement) => void} */
const hideDeleteButton = button => {
    button.disabled = true;
    button.classList.add('card__delete-button_disabled');
};

/** @type {(button: HTMLElement) => void} */
const activateLikeButton = button => {
    button.classList.add('card__like-button_is-active');
};

/** @type {(button: HTMLElement) => void} */
const deactivateLikeButton = button => {
    button.classList.remove('card__like-button_is-active');
};

/** @type {(isActive: boolean) => (cardElement: HTMLElement) => void} */
const setLikeButtonState = isActive => cardElement => {
    const setState = isActive ? activateLikeButton : deactivateLikeButton;
    return flow(getCardLikeButton, setState)(cardElement);
};

/** @type {(cardElement: HTMLElement) => void} */
const hideCardDeleteButton = flow(
    getDeleteCardButton,
    hideDeleteButton,
);

/** @type {(card: Card, user: { _id: string }) => HTMLElement} */
export const makeCardElement = (card, user) => {
    const isLiked = card.likes.find(it => it._id === user._id) !== undefined;

    return flow(
        getCardTemplate,
        cloneTemplateContent,
        getFirstChild,
        passthrough(setCardId(card._id)),
        passthrough(setCardImageAttributes(card)),
        passthrough(setCardTitle(card.name)),
        passthrough(setCardLikeNumber(card.likes.length)),
        passthrough(setLikeButtonState(isLiked)),
        passthrough(when(() => card.owner._id !== user._id, hideCardDeleteButton)),
    )();
};
