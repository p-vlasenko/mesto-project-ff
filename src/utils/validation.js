/**
 * @typedef {object} FormCssClasses
 * @property {string} inputBaseClass
 * @property {string} disabledSubmitButtonClass
 * @property {string} invalidInputClass
 * @property {string} visibleValidationErrorClass
 * @property {(inputId: InputId) => string} getInputErrorMessageElementClass
 */

import { getFirstElementByClassNameOrFail } from './dom.utils';

/**
 * @typedef {object} ValidationUtils
 * @property {() => void} enableValidation
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 */

/** @type {(formCssClasses: FormCssClasses) => ValidationUtils} */
export const makeValidationUtils = ({
    inputBaseClass,
    disabledSubmitButtonClass,
    invalidInputClass,
    visibleValidationErrorClass,
    getInputErrorMessageElementClass,
}) => {
    /** @type {(form: HTMLFormElement, input: HTMLInputElement) => void} */
    const handleInputValidity = (form, input) =>
        isValid(input)
            ? void hideInputError(form, input)
            : void showInputError(form, input, getErrorMessage(input));

    /** @type {(form: HTMLFormElement, input: HTMLInputElement, errorMessage: string) => void} */
    const showInputError = (form, input, errorMessage) => {
        const errorElement = getFirstElementByClassNameOrFail(
            getInputErrorMessageElementClass(input.id),
            form,
        );

        input.classList.add(invalidInputClass);
        addErrorMessage(errorElement, errorMessage);
    };

    /** @type {(form: HTMLFormElement, input: HTMLInputElement) => void} */
    const hideInputError = (form, input) => {
        const errorElement = getFirstElementByClassNameOrFail(
            getInputErrorMessageElementClass(input.id),
            form,
        );

        input.classList.remove(invalidInputClass);
        removeErrorMessage(errorElement);
    };

    /** @type {(input: HTMLSpanElement) => void} */
    const addErrorMessage = (errorElement, message) => {
        errorElement.textContent = message;
        errorElement.classList.add(visibleValidationErrorClass);
    };

    /** @type {(input: HTMLSpanElement) => void} */
    const removeErrorMessage = errorElement => {
        errorElement.classList.remove(visibleValidationErrorClass);
        errorElement.textContent = '';
    };

    /** @type {(form: HTMLFormElement) => HTMLInputElement[]} */
    const getInputs = form => Array.from(form.querySelectorAll(`.${inputBaseClass}`));

    /** @type {(form: HTMLFormElement) => void} */
    const setEventListeners = form => {
        const inputs = getInputs(form);
        const submitButton = form.querySelector('button[type="submit"]');

        toggleButtonState(inputs, submitButton);

        inputs.forEach(inputElement => {
            inputElement.addEventListener('input', () => {
                handleInputValidity(form, inputElement);
                toggleButtonState(inputs, submitButton);
            });
        });
    };

    /** @type {(button: HTMLButtonElement) => void} */
    const disableButton = button => {
        button.disabled = true;
        button.classList.add(disabledSubmitButtonClass);
    };

    /** @type {(button: HTMLButtonElement) => void} */
    const enableButton = button => {
        button.disabled = false;
        button.classList.remove(disabledSubmitButtonClass);
    };

    /** @type {(inputs: HTMLInputElement[], button: HTMLButtonElement) => string} */
    const toggleButtonState = (inputs, submitButton) =>
        hasInvalidInput(inputs)
            ? void disableButton(submitButton)
            : void enableButton(submitButton);

    /** @type {ValidationUtils['enableValidation']} */
    const enableValidation = () => {
        const forms = Array.from(document.forms);
        forms.forEach(form => void setEventListeners(form));
    };

    /** @type {ValidationUtils['resetValidationErrors']} */
    const resetValidationErrors = form => {
        const inputs = Array.from(form.querySelectorAll(`.${inputBaseClass}`));
        inputs.forEach(input => hideInputError(form, input));
    };

    return {
        disableButton,
        enableButton,
        toggleButtonState,
        enableValidation,
        resetValidationErrors,
    };
};

/** @type {(input: HTMLInputElement) => void} */
const isValid = input => input.validity.valid;

/** @type {(input: HTMLInputElement) => string} */
const getErrorMessage = input => {
    const message = input.validity.patternMismatch ? input.dataset.patternMismatchErrorMessage : '';

    return message !== '' ? message : input.validationMessage;
};

/** @type {(inputs: HTMLInputElement[]) => boolean} */
const hasInvalidInput = inputs => inputs.some(input => !input.validity.valid);
