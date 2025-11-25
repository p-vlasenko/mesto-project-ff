import { initFormModalHandlers } from '../components/modal.js';
import { SAVING_TEXT } from './constants.js';

/**
 * @typedef {import('../components/modal.js').FromElements} FromElements
 * @typedef {import('../components/modal.js').ModalElements} ModalElements
 */

/**
 * @typedef {object} ProfileElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 */

/**
 * @typedef {FromElements & ModalElements & ProfileElements} ProfileWorkflowElements
 */

/** @typedef {import('../types.js').User} User */
/** @typedef {import('../types.js').UpdateUserParams} UpdateUserParams */

/**
 * @typedef {object} ProfileFlowDeps
 * @property {User} user
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 * @property {(params: UpdateUserParams) => Promise<User>} updateUser
 * @property {(button: HTMLElement) => void} disableButton
 */

/** @type {(params: ProfileFlowDeps) => (elements: ProfileWorkflowElements) => void} */
export const initEditProfileModal = deps => elements => {
    const { user, updateUser, resetValidationErrors, disableButton } = deps;

    const {
        nameInput,
        descriptionInput,
        profileTitleElement,
        profileDescriptionElement,
        form,
        submitFormButton,
        ...fromModalElements
    } = elements;

    profileTitleElement.textContent = user.name;
    profileDescriptionElement.textContent = user.about;

    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;

    /** @type {() => UpdateUserParams} */
    const getUserParams = () => ({
        name: nameInput.value,
        about: descriptionInput.value,
    });

    /** @type {(updatedUser: User) => void} */
    const setUserData = updatedUser => {
        profileTitleElement.textContent = updatedUser.name;
        profileDescriptionElement.textContent = updatedUser.about;
    };

    /** @type {() => Promise<void>} */
    const onSubmit = () => {
        const buttonText = submitFormButton.textContent;
        submitFormButton.textContent = SAVING_TEXT;
        submitFormButton.disabled = true;

        return updateUser(getUserParams())
            .then(setUserData)
            .catch(err => console.error('Error updating user profile:', err))
            .finally(() => void (submitFormButton.textContent = buttonText));
    };

    const setInputValues = () => {
        disableButton(submitFormButton);
        nameInput.value = profileTitleElement.textContent;
        descriptionInput.value = profileDescriptionElement.textContent;
    };

    initFormModalHandlers({
        elements: { form, submitFormButton, ...fromModalElements },
        handlers: {
            onSubmit,
            onOpen: setInputValues,
            onClose: () => resetValidationErrors(form),
        },
    });
};
