import {
    getFormOrFail,
    getFormSubmitButton,
    getFromElementOrFail,
} from './form.js';
import {
    getModalCloseButton,
    initFormModalHandlers,
} from './modal.js';
import {
    flow,
    isEmptyText,
    makeStrictFirstElementByClassNameGetter,
    noop,
} from './utils.js';

/**
 * @typedef {object} ProfileWorkflowAdditionalElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 */

/**
 * @typedef {Omit<import('./utils.js').ModalFromElements, 'inputs'> & ProfileWorkflowAdditionalElements} ProfileWorkflowElements
 */

const getProfileEditButton = makeStrictFirstElementByClassNameGetter('profile__edit-button', document);
const getProfileEditFormModal = makeStrictFirstElementByClassNameGetter('popup_type_edit', document);
const getProfileTitleElement = makeStrictFirstElementByClassNameGetter('profile__title', document);
const getProfileDescriptionElement = makeStrictFirstElementByClassNameGetter('profile__description', document);

/** @type {() => ProfileWorkflowElements} */
const getElements = () => {
    const modal = getProfileEditFormModal();
    const form = getFormOrFail('edit-profile');

    return ({
        modal,
        form,
        openModalButton: getProfileEditButton(),
        closeModalButton: getModalCloseButton(modal),
        nameInput: getFromElementOrFail(form, 'name'),
        descriptionInput: getFromElementOrFail(form, 'description'),
        submitFormButton: getFormSubmitButton(form),
        profileTitleElement: getProfileTitleElement(),
        profileDescriptionElement: getProfileDescriptionElement(),
    });
};

/** @type {(elements: ProfileWorkflowElements) => void} */
const initEditProfileModal = elements => {
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

export const initProfileWorkflow = flow(getElements, initEditProfileModal);
