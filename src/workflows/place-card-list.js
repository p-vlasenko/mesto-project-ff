import { makeCardElement } from '../components/card.js';
import { initModalHandlers } from '../components/modal.js';
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
 * @typedef {import('../types.js').User} User
 */

/** @type {(element: HTMLElement) => boolean} */
const isDeleteButton = element => element.classList.contains('card__delete-button');

/** @type {(element: HTMLElement) => boolean} */
const isLikeButton = element => element.classList.contains('card__like-button');

/** @type {(element: HTMLElement) => boolean} */
const isImage = element => element.classList.contains('card__image');

/** @type {(element: HTMLElement) => void} */
const removeClosestCardElement = makeClosestElementByClassNameRemover('.card');

/** @type {(cardLikeButton: HTMLElement) => void} */
const toggleLikeButton = cardLikeButton => {
    cardLikeButton.classList.toggle('card__like-button_is-active');
};

/** @type {(cardLikeButton: HTMLElement) => boolean} */
const isActiveLike = cardLikeButton => cardLikeButton.classList.contains('card__like-button_is-active');

/** @type {deps: Pick<PlaceListWorkflowDeps, 'addCardLike' | 'removeCardLike'> => (element: HTMLElement) => void} */
const makeLikeButtonHandler = ({ addCardLike, removeCardLike }) => cardLikeButton => {
    const toggleLike = isActiveLike(cardLikeButton) ? removeCardLike : addCardLike;
    const cardElement = cardLikeButton.closest('.card');
    const cardId = cardElement.dataset.id;

    toggleLike(cardId).then(reust => {
        console.log('reust:', reust);
        return toggleLikeButton(cardLikeButton);
    });
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

    const handleClick = cardButtonClickHandlers[getElementType(evt.target)];
    handleClick?.(evt.target);
};

/** @type {(handlers: CardButtonHandlers) => (cardList: HTMLElement) => void} */
const addCardButtonHandlers = handlers => cardList => {
    const handleCardButtonClick = makeCardButtonClickHandler(handlers);
    cardList.addEventListener('click', handleCardButtonClick);
};

/** @type {(cards: Card[], user: User) => (cardListElement: HTMLElement) => void} */
const addCards = (cards, user) => cardListElement => flow(
    map(card => makeCardElement(card, user)),
    wrapToFragment,
    appendTo(cardListElement),
)(cards);

/**
 * @typedef {object} PlaceListWorkflowDeps
 * @property {User} user
 * @property {Card[]} cards
 * @property {(id: Card['_id']) => Promise<void>} deleteCard
 * @property {(id: Card['_id']) => Promise<void>} addCardLike
 * @property {(id: Card['_id']) => Promise<void>} removeCardLike
 */

/** @type {(deps: PlaceListWorkflowDeps) => (elements: CardWorkflowElements) => void} */
export const initPlacesList = deps => elements => {
    const { cards, user, deleteCard, addCardLike, removeCardLike } = deps;

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

    const onDeleteButtonClick = button => {
        const cardElement = button.closest('.card');
        const cardId = cardElement.dataset.id;

        deleteCard(cardId).then(() => void removeClosestCardElement(button));
    };

    return flow(
        passthrough(addCards(cards, user)),
        addCardButtonHandlers({
            onDeleteButtonClick,
            onLikeButtonClick: makeLikeButtonHandler({
                addCardLike,
                removeCardLike,
            }),
            onImageClick: image => {
                initImageModalContent({ link: image.src, name: image.alt });
                openImageModal();
            },
        }),
    )(placesListElement);
};
