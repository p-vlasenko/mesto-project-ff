import { initFormModalHandlers, initModalHandlers } from './modal.js';
import {
    appendTo,
    cloneTemplateContent,
    flow,
    getFirstElementByClassNameOrFail,
    isEmptyText,
    makeClosestElementByClassNameRemover,
    makeStrictTemplateElementGetter,
    map,
    noop,
    passthrough,
    setImageAttributes,
    setText,
    wrapToFragment,
} from './utils.js';

/**
 * @typedef {object} Card
 * @property {string} name
 * @property {string} link
 */

/**
 * @typedef {object} CardWorkflowElements
 * @property {HTMLElement} addCardButton
 * @property {HTMLElement} closeNewCardModalButton
 * @property {HTMLFormElement} newCardFrom
 * @property {HTMLButtonElement} submitNewCardFormButton
 * @property {HTMLInputElement} placeNameInput
 * @property {HTMLInputElement} linkInput
 * @property {HTMLElement} imageModal
 * @property {HTMLElement} closeImageModalButton
 * @property {HTMLImageElement} imageModalImage
 * @property {HTMLElement} imageModalTitleElement
 * @property {HTMLElement} cardImage
 * @property {HTMLElement} placesListElement
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
const makeCardElement = card => flow(
    getCardTemplate,
    cloneTemplateContent,
    passthrough(setCardImageAttributes(card)),
    passthrough(setCardTitle(card.name)),
)();

/** @type {(element: HTMLElement) => boolean} */
const isDeleteButton = element => element.classList.contains('card__delete-button');

/** @type {(element: HTMLElement) => boolean} */
const isLikeButton = element => element.classList.contains('card__like-button');

/** @type {(element: HTMLElement) => boolean} */
const isImage = element => element.classList.contains('card__image');

/** @type {(element: HTMLElement) => void} */
const removeClosestCardElement = makeClosestElementByClassNameRemover('.card');

/** @type {(element: HTMLElement) => void} */
const toggleLike = cardLikeButton => {
    cardLikeButton.classList.toggle('card__like-button_is-active');
};

const cardElement = {
    likeButton: 'like',
    deleteButton: 'delete',
    image: 'image',
};

const UNKNOWN_BUTTON_TYPE = Symbol('UNKNOWN_BUTTON_TYPE');

/** @type {(element: HTMLElement) => keyof typeof cardElement | typeof UNKNOWN_BUTTON_TYPE} */
const getElementType = element =>
    isDeleteButton(element) ? cardElement.deleteButton :
    isLikeButton(element) ? cardElement.likeButton :
    isImage(element) ? cardElement.image :
    UNKNOWN_BUTTON_TYPE;

/**
 * @typedef {object} CardButtonHandlers
 * @property {(button: HTMLElement) => void} onLikeButtonClick
 * @property {(imageElement: HTMLImageElement) => void} onImageClick
 * @property {(button: HTMLElement) => void} onDeleteButtonClick
 */

/** @type {(handlers: CardButtonHandlers) => (evt: PointerEvent) => void} */
const makeCardButtonClickHandler = ({ onDeleteButtonClick, onLikeButtonClick, onImageClick }) => evt => {
    const cardButtonClickHandlers = {
        [cardElement.deleteButton]: onDeleteButtonClick,
        [cardElement.likeButton]: onLikeButtonClick,
        [cardElement.image]: onImageClick,
    };

    const handler = cardButtonClickHandlers[getElementType(evt.target)];
    handler?.(evt.target);
};

/** @type {(handlers: CardButtonHandlers) => (cardList: HTMLElement) => void} */
const addCardButtonHandlers = handlers => cardList => {
    const handleCardButtonClick = makeCardButtonClickHandler(handlers);
    cardList.addEventListener('click', handleCardButtonClick);
};

/** @type {(cards: Card[]) => (cardListElement: HTMLElement) => void} */
const addCards = cards => cardListElement => flow(
    map(makeCardElement),
    wrapToFragment,
    appendTo(cardListElement),
)(cards);

/** @type {(elements: CardWorkflowElements) => void} */
export const initNewCardModal = elements => {
    const {
        submitNewCardFormButton,
        placeNameInput,
        linkInput,
        placesListElement,
        newCardFrom,
        newCardModal,
        addCardButton,
        closeNewCardModalButton,
    } = elements;

    const newCardInputs = [placeNameInput, linkInput];

    const isNewCardFormValid = () => newCardInputs.every(input => !isEmptyText(input.value));

    const onNewCardFromSubmit = () => {
        const newCardElement = makeCardElement({
            name: placeNameInput.value,
            link: linkInput.value,
        });

        placesListElement.prepend(newCardElement);
        newCardFrom.reset();
    };

    initFormModalHandlers({
        elements: {
            inputs: newCardInputs,
            submitFormButton: submitNewCardFormButton,
            form: newCardFrom,
            openModalButton: addCardButton,
            modal: newCardModal,
            closeModalButton: closeNewCardModalButton,
        },
        handlers: {
            isFormValid: isNewCardFormValid,
            onSubmit: onNewCardFromSubmit,
            onClose: () => newCardFrom.reset(),
            onOpen: noop,
        },
    });
};

/** @type {(cards: Card[]) => (elements: CardWorkflowElements) => void} */
export const initPlacesList = cards => elements => {
    const {
        placesListElement,
        imageModal,
        closeImageModalButton,
        imageModalImage,
        imageModalTitleElement,
    } = elements;

    /** @type {() => void} */
    const resetImageModalContent = () => {
        imageModalImage.src = '';
        imageModalImage.alt = '';
        imageModalTitleElement.textContent = '';
    };

    /** @type {(card: Card) => void} */
    const initImageModalContent = ({ link, name }) => {
        imageModalImage.src = link;
        imageModalImage.alt = name;
        imageModalTitleElement.textContent = name;
    };

    const { open: openImageModal } = initModalHandlers({
        elements: {
            modal: imageModal,
            closeModalButton: closeImageModalButton,
        },
        handlers: {
            onClose: resetImageModalContent,
            onOpen: noop,
        },
    });

    return flow(
        passthrough(addCards(cards)),
        addCardButtonHandlers({
            onDeleteButtonClick: removeClosestCardElement,
            onLikeButtonClick: toggleLike,
            onImageClick: image => {
                initImageModalContent({ link: image.src, name: image.alt });
                openImageModal();
            },
        }),
    )(placesListElement);
};
