import { initFormModalHandlers } from '../components/modal.js';

/**
 * @typedef {object} ProfileElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 */

/**
 * @typedef {Omit<import('../components/modal.js').FromElements, 'inputs'> & ProfileElements} ProfileWorkflowElements
 */

/** @type {(handlers: { resetValidationErrors: (form: HTMLFormElement) => void }) => (elements: ProfileWorkflowElements) => void} */
export const initEditProfileModal = ({ resetValidationErrors }) => elements => {
    const {
        nameInput,
        descriptionInput,
        submitFormButton,
        profileTitleElement,
        profileDescriptionElement,
        form,
        ...rest
    } = elements;

    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;

    const onSubmit = () => {
        profileTitleElement.textContent = nameInput.value;
        profileDescriptionElement.textContent = descriptionInput.value;
    };

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
