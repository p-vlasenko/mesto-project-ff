import { initFormModalHandlers } from './modal.js';
import { isEmptyText, noop } from './utils.js';

/**
 * @typedef {object} ProfileElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 */

/**
 * @typedef {Omit<import('./utils.js').ModalFromElements, 'inputs'> & ProfileElements} ProfileWorkflowElements
 */

/** @type {(elements: ProfileWorkflowElements) => void} */
export const initEditProfileModal = elements => {
    const {
        nameInput,
        descriptionInput,
        submitFormButton,
        profileTitleElement,
        profileDescriptionElement,
        ...rest
    } = elements;

    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;

    const inputs = [nameInput, descriptionInput];

    const isFormValid = () => inputs.every(input => !isEmptyText(input.value));

    const onSubmit = () => {
        profileTitleElement.textContent = nameInput.value;
        profileDescriptionElement.textContent = descriptionInput.value;
    };

    const setInputValues = () => {
        nameInput.value = profileTitleElement.textContent;
        profileDescriptionElement.textContent = descriptionInput.value;
    };

    initFormModalHandlers({
        elements: { submitFormButton, inputs, ...rest },
        handlers: {
            isFormValid,
            onSubmit,
            onOpen: setInputValues,
            onClose: noop,
        },
    });
};
