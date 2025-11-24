import './images/avatar.jpg';
import './images/logo.svg';
import './pages/index.css';

/** see README.md about modules structure */
import { makeCardsApi } from './api/cards-api.js';
import { AUTH_TOKEN, BASE_URL } from './api/constants.js';
import { makeUserApi } from './api/user-api.js';
import { getModalCloseButton } from './components/modal.js';
import {
    getButton,
    getFirstElementByClassNameOrFail,
    getFormOrFail,
    getFromElementOrFail,
} from './utils/dom.utils.js';
import { flow, passthrough } from './utils/utils.js';
import { makeValidationUtils } from './utils/validation.js';
import { initAvatarEditModal } from './workflows/avatar-modal.js';
import { initNewCardModal } from './workflows/new-card-modal.js';
import { initPlacesList } from './workflows/place-card-list.js';
import { initEditProfileModal } from './workflows/profile-modal.js';

/** @typedef {import('./workflows/types.js').CardWorkflowElements} CardWorkflowElements */
/** @typedef {import('./workflows/profile-modal.js').ProfileWorkflowElements} ProfileWorkflowElements */
/** @typedef {import('./workflows/avatar-modal.js').AvatarWorkflowElements} AvatarWorkflowElements */
/** @typedef {import('./api/user-api.js').UserApi} UserApi */
/** @typedef {import('./workflows/place-card-list.js').PlaceListWorkflowDeps} PlaceListWorkflowDeps */

/** @type {() => CardWorkflowElements} */
const getCardsWorkflowElements = () => {
    const newCardModal = getFirstElementByClassNameOrFail('popup_type_new-card', document);
    const imageModal = getFirstElementByClassNameOrFail('popup_type_image', document);
    const newCardFrom = getFormOrFail('new-place');
    const deleteCardModal = getFirstElementByClassNameOrFail('popup_type_delete-card', document);

    return ({
        newCardModal,
        imageModal,
        newCardFrom,
        deleteCardModal,
        placesListElement: getFirstElementByClassNameOrFail('places__list', document),
        placeNameInput: getFromElementOrFail(newCardFrom, 'place-name'),
        linkInput: getFromElementOrFail(newCardFrom, 'link'),
        addCardButton: getFirstElementByClassNameOrFail('profile__add-button', document),
        closeNewCardModalButton: getModalCloseButton(newCardModal),
        closeImageModalButton: getModalCloseButton(imageModal),
        submitNewCardFormButton: getButton(newCardFrom),
        imageModalImage: getFirstElementByClassNameOrFail('popup__image', document),
        imageModalTitleElement: getFirstElementByClassNameOrFail('popup__caption', document),
        closeDeleteCardModalButton: getModalCloseButton(deleteCardModal),
        deleteCardConfirmButton: getButton(deleteCardModal),
    });
};

const { enableValidation, resetValidationErrors, disableButton } = makeValidationUtils({
    inputBaseClass: 'popup__input',
    disabledSubmitButtonClass: 'popup__button_disabled',
    invalidInputClass: 'popup__input_type_error',
    visibleValidationErrorClass: `popup__input-error_active`,
    getInputErrorMessageElementClass: inputId => `${inputId}-error`,
});

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
        submitFormButton: getButton(form),
        profileTitleElement: getFirstElementByClassNameOrFail('profile__title', document),
        profileDescriptionElement: getFirstElementByClassNameOrFail('profile__description', document),
    });
};

/** @type {() => AvatarWorkflowElements} */
const getAvatarWorkflowElements = () => {
    const modal = getFirstElementByClassNameOrFail('popup_type_edit-avatar', document);
    const form = getFormOrFail('edit-avatar');
    const avatarImageElement = getFirstElementByClassNameOrFail('profile__image', document);

    return ({
        modal,
        form,
        avatarImageElement,
        openModalButton: avatarImageElement,
        closeModalButton: getModalCloseButton(modal),
        submitFormButton: getButton(form),
        avatarImageInput: getFromElementOrFail(form, 'avatar-link'),
    });
};

/**
 * @typedef {object} ProfileWorkflowDeps
 * @property {User} user
 * @property {UserApi['updateUser']} updateUser
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 */

const { getUser, updateUser, updateAvatar } = makeUserApi({
    baseUrl: BASE_URL,
    authToken: AUTH_TOKEN,
});

const { getCards, addCard, deleteCard, addCardLike, removeCardLike } = makeCardsApi({
    baseUrl: BASE_URL,
    authToken: AUTH_TOKEN,
});

enableValidation();

/** @type {(deps: ProfileWorkflowDeps) => void} */
const initProfileWorkflow = ({ user }) => flow(
    getProfileWorkflowElements,
    initEditProfileModal({
        user,
        resetValidationErrors,
        updateUser,
        disableButton,
    }),
)();

/** @type {(deps: ProfileWorkflowDeps) => void} */
const initAvatarWorkflow = ({ user }) => flow(
    getAvatarWorkflowElements,
    initAvatarEditModal({
        user,
        resetValidationErrors,
        updateAvatar,
        disableButton,
    }),
)();

/** @type {(deps: Pick<PlaceListWorkflowDeps, 'user' | 'cards'>) => void} */
const initPlaceCardsWorkflow = ({ user, cards }) => {
    const deps = {
        resetValidationErrors,
        addCard,
        deleteCard,
        addCardLike,
        removeCardLike,
    };

    return flow(
        getCardsWorkflowElements,
        passthrough(initPlacesList({ ...deps, user, cards })),
        initNewCardModal({ ...deps, user, cards }),
    )();
};

await Promise.all([getUser(), getCards()]).then(([user, cards]) => {
    initProfileWorkflow({ user });
    initAvatarWorkflow({ user });
    initPlaceCardsWorkflow({ user, cards });
});
