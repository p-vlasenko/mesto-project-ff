import { initModalHandlers } from '../components/modal.js';
import { makeCardElement } from '../components/card.js';
import {
    appendTo,
    makeClosestElementByClassNameRemover,
    wrapToFragment,
} from '../utils/dom.utils.js';
import {
    flow,
    map,
    noop,
    passthrough,
} from '../utils/utils.js';

/**
 * @typedef {import('../components/card.js').Card} Card
 * @typedef {import('./types.js').CardWorkflowElements} CardWorkflowElements
 */

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
