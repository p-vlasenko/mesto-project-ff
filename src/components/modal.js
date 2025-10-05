import { getFirstElementByClassNameOrFail, makeKeydownHandler } from './utils.js';

/**
 * @param {HTMLElement} modal
 * @returns {void}
 */
export const showModal = modal => {
    modal.classList.add('popup_is-opened');
};

/**
 * @param {HTMLElement} modal
 * @returns {void}
 */
export const closeModal = modal => {
    modal.classList.remove('popup_is-opened');
};

/**
 * @param {HTMLButtonElement} button
 * @returns {void}
 */
export const disableModalButton = button => {
    button.classList.add('popup__button_disabled');
    button.disabled = true;
};

/**
 * @param {HTMLButtonElement} button
 * @returns {void}
 */
export const enableModalButton = button => {
    button.classList.remove('popup__button_disabled');
    button.disabled = false;
};

/**
 * @param {HTMLElement} modal
 * @returns {HTMLButtonElement}
 */
export const getModalCloseButton = modal => getFirstElementByClassNameOrFail(
    'popup__close',
    modal,
);

/**
 * @typedef {object} ModalElements
 * @property {HTMLElement} openModalButton
 * @property {HTMLElement} closeModalButton
 * @property {HTMLElement} modal
 */

/**
 * @typedef {object} FromElements
 * @property {HTMLElement} submitFromButton
 * @property {HTMLElement} form
 * @property {HTMLInputElement[]} inputs
 */

/**
 * @typedef {object} ModalFromHandlers
 * @property {() => void} onSubmit
 * @property {(form: HTMLFormElement) => boolean} isFormValid
 * @property {() => void} beforeClose
 * @property {() => void} beforeOpen
 */

/**
 * @param {object} params
 * @param {ModalElements|FromElements} params.elements
 * @param {ModalFromHandlers} params.handlers
 *
 * @returns {{
 *   open: () => void;
 *   close: () => void;
 * }}
 */
export const initFormModalHandlers = ({ elements, handlers }) => {
    const {
        submitFormButton,
        inputs,
        form,
        openModalButton,
        ...popupElements
    } = elements;

    const { onSubmit, isFormValid, beforeClose, beforeOpen } = handlers;

    const setSubmitButtonState = () => {
        if (isFormValid(form)) {
            enableModalButton(submitFormButton);
        }
        else {
            disableModalButton(submitFormButton);
        }
    };

    setSubmitButtonState();

    const { open, close } = initModalHandlers({
        elements: popupElements,
        handlers: { beforeClose, beforeOpen },
    });

    openModalButton.addEventListener('click', open);

    const handleSubmitButtonClick = evt => {
        evt.preventDefault();
        onSubmit();
        close();
    };

    submitFormButton.addEventListener('click', handleSubmitButtonClick);

    inputs.forEach(input => input.addEventListener('input', setSubmitButtonState));
};

/**
 * @param {ModalElements} param
 * @param {ModalElements} param.elements
 * @param {{ beforeClose: () => void }} param.handler
 *
 * @returns {{
 *   open: () => void;
 *   close: () => void;
 * }}
 */
export const initModalHandlers = ({ elements, handlers }) => {
    const { closeModalButton, modal } = elements;
    const { beforeClose, beforeOpen } = handlers;

    const close = () => {
        closeModal(modal);
        document.removeEventListener('keydown', handleEscapeKeydown);
        beforeClose();
    };

    const handleEscapeKeydown = makeKeydownHandler('Escape', close);

    const handleModalOverlayClick = evt => {
        if (evt.target === modal) {
            close();
        }
    };

    closeModalButton.addEventListener('click', close);
    modal.addEventListener('mousedown', handleModalOverlayClick);

    const open = () => {
        beforeOpen();
        showModal(modal);
        document.addEventListener('keydown', handleEscapeKeydown);
    };

    return { open, close };
};
