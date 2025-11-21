import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';

/** see README.md about modules structure */
import { makeCardsApi } from './api/cards-api.js';
import { AUTH_TOKEN, BASE_URL } from './api/constants.js';
import { makeUserApi } from './api/user-api.js';
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
/** @typedef {import('./api/user-api.js').UserApi} UserApi */
/** @typedef {import('./workflows/place-card-list.js').PlaceListWorkflowDeps} PlaceListWorkflowDeps */

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

/** @type {(deps: PlaceListWorkflowDeps) => void} */
const initPlaceCardsWorkflow = deps => flow(
    getCardsWorkflowElements,
    passthrough(initPlacesList(deps)),
    initNewCardModal(deps),
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
        profileImageElement: getFirstElementByClassNameOrFail('profile__image', document),
    });
};

/**
 * @typedef {object} ProfileWorkflowDeps
 * @property {User} user
 * @property {UserApi['updateUser']} updateUser
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 */

/** @type {(deps: ProfileWorkflowDeps) => void} */
const initProfileWorkflow = ({ user, updateUser }) => flow(
    getProfileWorkflowElements,
    initEditProfileModal({
        user,
        resetValidationErrors,
        updateUser,
    }),
)();

const { getUser, updateUser } = makeUserApi({
    baseUrl: BASE_URL,
    authToken: AUTH_TOKEN,
});

const { getCards, addCard, deleteCard, addCardLike, removeCardLike } = makeCardsApi({
    baseUrl: BASE_URL,
    authToken: AUTH_TOKEN,
});

enableValidation();

await Promise.all([getUser(), getCards()]).then(([user, cards]) => {
    initProfileWorkflow({ user, updateUser, resetValidationErrors });
    initPlaceCardsWorkflow({
        user,
        cards,
        resetValidationErrors,
        addCard,
        deleteCard,
        addCardLike,
        removeCardLike,
    });
});
