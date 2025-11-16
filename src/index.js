import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';

/** see README.md about modules structure */
import { initialCards } from './components/card.js';
import { getModalCloseButton } from './components/modal.js';
import {
    getFirstElementByClassNameOrFail,
    getFormOrFail,
    getFormSubmitButton,
    getFromElementOrFail,
} from './utils/dom.utils.js';
import { flow, passthrough } from './utils/utils.js';
import { makeValidationUtils } from './utils/validation.js';
import { initNewCardModal } from './workflows/new-card-modal.js';
import { initPlacesList } from './workflows/place-card-list.js';
import { initEditProfileModal } from './workflows/profile-modal.js';

/** @typedef {import('./workflows/types.js').CardWorkflowElements} CardWorkflowElements */
/** @typedef {import('./workflows/profile-modal.js').ProfileWorkflowElements} ProfileWorkflowElements */

/** @type {() => CardWorkflowElements} */
const getCardsWorkflowElements = () => {
    const newCardModal = getFirstElementByClassNameOrFail('popup_type_new-card', document);
    const imageModal = getFirstElementByClassNameOrFail('popup_type_image', document);
    const newCardFrom = getFormOrFail('new-place');

    return ({
        newCardModal,
        imageModal,
        newCardFrom,
        placesListElement: getFirstElementByClassNameOrFail('places__list', document),
        placeNameInput: getFromElementOrFail(newCardFrom, 'place-name'),
        linkInput: getFromElementOrFail(newCardFrom, 'link'),
        addCardButton: getFirstElementByClassNameOrFail('profile__add-button', document),
        closeNewCardModalButton: getModalCloseButton(newCardModal),
        closeImageModalButton: getModalCloseButton(imageModal),
        submitNewCardFormButton: getFormSubmitButton(newCardFrom),
        imageModalImage: getFirstElementByClassNameOrFail('popup__image', document),
        imageModalTitleElement: getFirstElementByClassNameOrFail('popup__caption', document),
    });
};

const { enableValidation, resetValidationErrors } = makeValidationUtils({
    inputBaseClass: 'popup__input',
    disabledSubmitButtonClass: 'popup__button_disabled',
    invalidInputClass: 'popup__input_type_error',
    visibleValidationErrorClass: `popup__input-error_active`,
    getInputErrorMessageElementClass: inputId => `${inputId}-error`,
});

/** @type {(cards: Card[]) => void} */
const initPlaceCardsWorkflow = cards => flow(
    getCardsWorkflowElements,
    passthrough(initPlacesList(cards)),
    initNewCardModal({ resetValidationErrors }),
)();

/** @type {() => ProfileWorkflowElements} */
const getProfileWorkflowElements = () => {
    const modal = getFirstElementByClassNameOrFail('popup_type_edit', document);
    const form = getFormOrFail('edit-profile');

    return ({
        modal,
        form,
        openModalButton: getFirstElementByClassNameOrFail('profile__edit-button', document),
        closeModalButton: getModalCloseButton(modal),
        nameInput: getFromElementOrFail(form, 'name'),
        descriptionInput: getFromElementOrFail(form, 'description'),
        submitFormButton: getFormSubmitButton(form),
        profileTitleElement: getFirstElementByClassNameOrFail('profile__title', document),
        profileDescriptionElement: getFirstElementByClassNameOrFail('profile__description', document),
    });
};

/** @type {() => void} */
const initProfileWorkflow = flow(
    getProfileWorkflowElements,
    initEditProfileModal({ resetValidationErrors }),
);

initProfileWorkflow();
initPlaceCardsWorkflow(initialCards);
enableValidation();
