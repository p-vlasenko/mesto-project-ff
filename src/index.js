import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';

import { initNewCardModal, initPlacesList, initialCards } from './components/cards.js';
import { getFormOrFail, getFormSubmitButton, getFromElementOrFail } from './components/form.js';
import { getModalCloseButton } from './components/modal.js';
import { initEditProfileModal } from './components/profile.js';
import {
    flow,
    getFirstElementByClassNameOrFail,
    passthrough,
} from './components/utils.js';

/** @typedef {import('./components/cards.js').CardWorkflowElements} CardWorkflowElements */
/** @typedef {import('./components/profile.js').ProfileWorkflowElements} ProfileWorkflowElements */

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

/** @type {(cards: Card[]) => void} */
const initPlaceCardsWorkflow = cards => flow(
    getCardsWorkflowElements,
    passthrough(initPlacesList(cards)),
    initNewCardModal,
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
const initProfileWorkflow = flow(getProfileWorkflowElements, initEditProfileModal);

initProfileWorkflow();
initPlaceCardsWorkflow(initialCards);
