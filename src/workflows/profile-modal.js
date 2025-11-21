import { initFormModalHandlers } from '../components/modal.js';

/**
 * @typedef {object} ProfileElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 * @property {HTMLElement} profileImageElement
 */

/**
 * @typedef {Omit<import('../components/modal.js').FromElements, 'inputs'> & ProfileElements} ProfileWorkflowElements
 */

/** @typedef {import('../types.js').User} User */
/** @typedef {import('../types.js').UpdateUserParams} UpdateUserParams */

/**
 * @typedef {object} ProfileFlowDeps
 * @property {User} user
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 * @property {(params: UpdateUserParams) => User} updateUser
 */

/** @type {(params: ProfileFlowDeps) => (elements: ProfileWorkflowElements) => void} */
export const initEditProfileModal = ({ user, updateUser, resetValidationErrors }) => elements => {
    const {
        nameInput,
        descriptionInput,
        submitFormButton,
        profileTitleElement,
        profileDescriptionElement,
        profileImageElement,
        form,
        ...rest
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
    const serUserData = updatedUser => {
        user = updatedUser;
        profileTitleElement.textContent = updatedUser.name;
        profileDescriptionElement.textContent = updatedUser.about;
    };

    /** @type {() => Promise<void>} */
    const onSubmit = () => updateUser(getUserParams()).then(serUserData);

    const setInputValues = () => {
        nameInput.value = profileTitleElement.textContent;
        descriptionInput.value = profileDescriptionElement.textContent;
    };

    initFormModalHandlers({
        elements: {
            form,
            submitFormButton,
            ...rest,
        },
        handlers: {
            onSubmit,
            onOpen: setInputValues,
            onClose: () => resetValidationErrors(form),
        },
    });
};
