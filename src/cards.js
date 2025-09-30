import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';
import {
    appendTo,
    cloneTemplateContent,
    flow,
    getFirstElementByClassNameOrFail,
    getFormOrFail,
    getFormSubmitButton,
    getFromElementOrFail,
    getPopupCloseButton,
    initFormPopupCommonHandlers,
    isEmptyText,
    isNil,
    makeClosestElementByClassNameRemover,
    makeStrictFirstElementByClassNameGetter,
    makeStrictTemplateElementGetter,
    map,
    passthrough,
    setImageAttributes,
    setText,
    wrapToFragment
} from './utils.js';

/**
 * @typedef {object} Card
 * @property {string} name
 * @property {string} link
 */

/**
 * @typedef {object} CardWorkflowElements
 * @property {HTMLElement} popupRootElement
 * @property {HTMLElement} openPopupButton
 * @property {HTMLElement} closePopupButton
 * @property {HTMLFormElement} from
 * @property {HTMLButtonElement} submitFormButton
 * @property {HTMLInputElement} placeNameInput
 * @property {HTMLInputElement} linkInput
 * @property {HTMLElement} placesListElement
 */

/**
 * @type {Card[]}
 */
const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

const getCardTemplate = makeStrictTemplateElementGetter('card-template', document);
const getCardListElement = makeStrictFirstElementByClassNameGetter('places__list', document);
const getPopupRoot = makeStrictFirstElementByClassNameGetter('popup_type_new-card', document);

/**
 * @param {HTMLElement} cardElement
 * @returns {HTMLImageElement}
 */
const getCardImageElement = cardElement => getFirstElementByClassNameOrFail('card__image', cardElement);

/**
 * @param {HTMLElement} cardElement
 * @returns {HTMLElement}
 */
const getCardTitleElement = cardElement => getFirstElementByClassNameOrFail('card__title', cardElement);

/**
 * @param {Card} param
 * @returns {(cardElement: HTMLElement) => void}
 */
const setCardImageAttributes = ({ name, link }) => flow(
    getCardImageElement,
    setImageAttributes({ src: link, alt: name})
);

/**
 * @param {string} title
 * @returns {(cardElement: HTMLElement) => void}
 */
const setCardTitle = title => flow(getCardTitleElement, setText(title));

/**
 * @param {Card} card
 * @returns {HTMLElement}
 */
const makeCardElement = card => flow(
    getCardTemplate,
    cloneTemplateContent,
    passthrough(setCardImageAttributes(card)),
    passthrough(setCardTitle(card.name)),
)();

const cardButton  = {
    like: 'like',
    delete: 'delete',
};

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const isDeleteButton = element => element.classList.contains('card__delete-button');

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const isLikeButton = element => element.classList.contains('card__like-button');

/**
 * @param {HTMLElement}
 * @returns {void}
 */
const removeClosestCardElement = makeClosestElementByClassNameRemover('.card');

/**
 * @param {HTMLElement}
 * @returns {void}
 */
const toggleLike = cardLikeButton => {
    cardLikeButton.classList.toggle('card__like-button_is-active');
}

const UNKNOWN_BUTTON_TYPE = Symbol('UNKNOWN_BUTTON_TYPE');

const getButtonType = element =>
    isDeleteButton(element) ? cardButton.delete :
    isLikeButton(element) ? cardButton.like :
    UNKNOWN_BUTTON_TYPE;

const cardButtonClickHandlers = {
    [cardButton.delete]: removeClosestCardElement,
    [cardButton.like]: toggleLike,
}

/**
 * @param {PointerEvent} evt
 * @returns {void}
 */
const handleCardButtonClick = evt => {
    const handler = cardButtonClickHandlers[getButtonType(evt.target)];
    handler?.(evt.target);
}

/**
 * @param {HTMLElement} cardList
 * @returns {void}
 */
const addCardButtonsHandler = (cardList) => {
    cardList.addEventListener('click', handleCardButtonClick);
}

/**
 *
 * @param {Card[]} cards
 * @returns {(cardListElement: HTMLElement) => void)}
 */
const addCards = cards => cardListElement => flow(
    map(makeCardElement),
    wrapToFragment,
    appendTo(cardListElement)
)(cards);

/**
 * @type {() => void}
 */
const initPlacesList = ({ placesListElement }) => flow(
    passthrough(addCards(initialCards)),
    addCardButtonsHandler,
)(placesListElement);

/**
 * @returns {CardWorkflowElements}
 */
const getElements = () => {
  const popupRootElement = getPopupRoot();
  const form = getFormOrFail('new-place');

  return ({
      popupRootElement,
      form,
      placesListElement: getCardListElement(),
      placeNameInput: getFromElementOrFail(form, 'place-name'),
      linkInput: getFromElementOrFail(form, 'link'),
      openPopupButton: getFirstElementByClassNameOrFail('profile__add-button', document),
      closePopupButton: getPopupCloseButton(popupRootElement),
      submitFormButton: getFormSubmitButton(form),
  });
};

/**
 * @param {CardWorkflowElements} elements
 * @returns {void}
 */
const initNewCardPopup = elements => {
    const {
        submitFormButton,
        placeNameInput,
        linkInput,
        placesListElement,
        form,
        ...rest
    } = elements;

    const inputs = [placeNameInput, linkInput];

    const isFormValid = () => inputs.every(input => !isEmptyText(input.value));

    const onSubmit = () => {
        const newCardElement = makeCardElement({
            name: placeNameInput.value,
            link: linkInput.value,
        });

        placesListElement.append(newCardElement);
        form.reset();
    };

    initFormPopupCommonHandlers({
        elements: { submitFormButton, inputs, form, ...rest },
        handlers: { isFormValid, onSubmit }
    });
};

/**
 * @returns {void}
 */
export const initPlaceCardsWorkflow = flow(
    getElements,
    passthrough(initPlacesList),
    initNewCardPopup
);
