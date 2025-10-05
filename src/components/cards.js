import {
    getFormOrFail,
    getFormSubmitButton,
    getFromElementOrFail,
} from './form.js';
import {
    getModalCloseButton,
    initFormModalHandlers,
    initModalHandlers,
} from './modal.js';
import {
    appendTo,
    cloneTemplateContent,
    flow,
    getFirstElementByClassNameOrFail,
    isEmptyText,
    makeClosestElementByClassNameRemover,
    makeStrictFirstElementByClassNameGetter,
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
 * @property {HTMLImageElement} previewImageElement
 * @property {HTMLElement} previewPlaceElement
 * @property {HTMLElement} cardImage
 * @property {HTMLElement} placesListElement
 */

/**
 * @type {Card[]}
 */
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
const getCardListElement = makeStrictFirstElementByClassNameGetter('places__list', document);
const getNewCardModal = makeStrictFirstElementByClassNameGetter('popup_type_new-card', document);
const getImageModal = makeStrictFirstElementByClassNameGetter('popup_type_image', document);
const getAddCardButton = makeStrictFirstElementByClassNameGetter('profile__add-button', document);

/**
 * @param {HTMLElement} cardElement
 * @returns {HTMLImageElement}
 */
const getCardImageElement = cardElement => getFirstElementByClassNameOrFail('card__image', cardElement);

/**
 * @returns {HTMLImageElement}
 */
const getPreviewImageElement = () => getFirstElementByClassNameOrFail('popup__image', document);

/**
 * @returns {HTMLImageElement}
 */
const getPreviewPlaceElement = () => getFirstElementByClassNameOrFail('popup__caption', document);

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
    setImageAttributes({ src: link, alt: name }),
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
 * @param {HTMLElement} element
 * @returns {boolean}
 */
const isImage = element => element.classList.contains('card__image');

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
};

const cardElement = {
    likeButton: 'like',
    deleteButton: 'delete',
    image: 'image',
};

const UNKNOWN_BUTTON_TYPE = Symbol('UNKNOWN_BUTTON_TYPE');

/**
 * @param {HTMLElement} element
 * @returns {keyof typeof cardElement | typeof UNKNOWN_BUTTON_TYPE}
 */
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

/**
 * @param {CardButtonHandlers} handlers
 * @returns {(evt: PointerEvent) => void}
 */
const makeCardButtonClickHandler = ({ onDeleteButtonClick, onLikeButtonClick, onImageClick }) => evt => {
    const cardButtonClickHandlers = {
        [cardElement.deleteButton]: onDeleteButtonClick,
        [cardElement.likeButton]: onLikeButtonClick,
        [cardElement.image]: onImageClick,
    };

    const handler = cardButtonClickHandlers[getElementType(evt.target)];
    handler?.(evt.target);
};

/**
 * @param {CardButtonHandlers} handlers
 * @returns {(cardList: HTMLElement) => void} cardList
 */
const addCardButtonsHandler = handlers => cardList => {
    const handleCardButtonClick = makeCardButtonClickHandler(handlers);
    cardList.addEventListener('click', handleCardButtonClick);
};

/**
 *
 * @param {Card[]} cards
 * @returns {(cardListElement: HTMLElement) => void)}
 */
const addCards = cards => cardListElement => flow(
    map(makeCardElement),
    wrapToFragment,
    appendTo(cardListElement),
)(cards);

/**
 * @type {() => void}
 */
const initPlacesList = cards => params => {
    const {
        placesListElement,
        imageModal,
        closeImageModalButton,
        previewImageElement,
        previewPlaceElement,
    } = params;

    const resetImagePreview = () => {
        previewImageElement.src = '';
        previewImageElement.alt = '';
        previewPlaceElement.textContent = '';
    };

    /**
     *
     * @param {Card} card
     */
    const initImagePreview = ({ link, name }) => {
        previewImageElement.src = link;
        previewImageElement.alt = name;
        previewPlaceElement.textContent = name;
    };

    const { open: openImagePreviewModal } = initModalHandlers({
        elements: {
            modal: imageModal,
            closeModalButton: closeImageModalButton,
        },
        handlers: {
            beforeClose: resetImagePreview,
            beforeOpen: noop,
        },
    });

    return flow(
        passthrough(addCards(cards)),
        addCardButtonsHandler({
            onDeleteButtonClick: removeClosestCardElement,
            onLikeButtonClick: toggleLike,
            onImageClick: image => {
                initImagePreview({ link: image.src, name: image.alt });
                openImagePreviewModal();
            },
        }),
    )(placesListElement);
};

/**
 * @returns {CardWorkflowElements}
 */
const getElements = () => {
    const newCardModal = getNewCardModal();
    const imageModal = getImageModal();
    const newCardFrom = getFormOrFail('new-place');

    return ({
        newCardModal,
        imageModal,
        newCardFrom,
        placesListElement: getCardListElement(),
        placeNameInput: getFromElementOrFail(newCardFrom, 'place-name'),
        linkInput: getFromElementOrFail(newCardFrom, 'link'),
        addCardButton: getAddCardButton(),
        closeNewCardModalButton: getModalCloseButton(newCardModal),
        closeImageModalButton: getModalCloseButton(imageModal),
        submitNewCardFormButton: getFormSubmitButton(newCardFrom),
        previewImageElement: getPreviewImageElement(),
        previewPlaceElement: getPreviewPlaceElement(),
    });
};

/**
 * @param {CardWorkflowElements} elements
 * @returns {void}
 */
const initNewCardModal = elements => {
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

        placesListElement.append(newCardElement);
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
            beforeClose: () => newCardFrom.reset(),
            beforeOpen: noop,
        },
    });
};

/**
 * @returns {void}
 */
export const initPlaceCardsWorkflow = cards => flow(
    getElements,
    passthrough(initPlacesList(cards)),
    initNewCardModal,
)();
