import {
    flow,
    getFormOrFail,
    getFormSubmitButton,
    getFromElementOrFail,
    getPopupCloseButton,
    initFormPopupCommonHandlers,
    isEmptyText,
    makeStrictFirstElementByClassNameGetter
} from './utils.js';

/**
 * @typedef {object} ProfileWorkflowAdditionalElements
 * @property {HTMLInputElement} nameInput
 * @property {HTMLInputElement} descriptionInput
 * @property {HTMLElement} profileTitleElement
 * @property {HTMLElement} profileDescriptionElement
 */

/**
 * @typedef {Omit<import('./utils.js').PopupFromElements, 'inputs'> & ProfileWorkflowAdditionalElements} ProfileWorkflowElements
 */

const getProfileEditButton = makeStrictFirstElementByClassNameGetter('profile__edit-button', document);
const getProfileEditFormPopup = makeStrictFirstElementByClassNameGetter('popup_type_edit', document);
const getProfileTitleElement = makeStrictFirstElementByClassNameGetter('profile__title', document);
const getProfileDescriptionElement = makeStrictFirstElementByClassNameGetter('profile__description', document);

/**
 * @returns {ProfileWorkflowElements}
 */
const getElements = () => {
    const popupRootElement = getProfileEditFormPopup();
    const form = getFormOrFail('edit-profile');

    return ({
        popupRootElement,
        form,
        openPopupButton: getProfileEditButton(),
        closePopupButton: getPopupCloseButton(popupRootElement),
        nameInput: getFromElementOrFail(form, 'name'),
        descriptionInput: getFromElementOrFail(form, 'description'),
        submitFormButton: getFormSubmitButton(form),
        profileTitleElement: getProfileTitleElement(),
        profileDescriptionElement: getProfileDescriptionElement()
    });
};

/**
 * @param {ProfileWorkflowElements} elements
 * @returns {void}
 */
const initEditProfilePopup = elements => {
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

    initFormPopupCommonHandlers({
        elements: { submitFormButton, inputs, ...rest },
        handlers: { isFormValid, onSubmit }
    });
};

export const initProfileWorkflow = flow(getElements, initEditProfilePopup);
