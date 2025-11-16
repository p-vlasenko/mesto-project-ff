/** see README.md about modules structure */
import {
    getFirstElementByClassNameOrFail,
    makeKeydownHandler,
} from '../utils/dom.utils.js';

/** @type {(modal: HTMLElement) => void} */
export const showModal = modal => {
    modal.classList.add('popup_is-opened');
};

/** @type {(modal: HTMLElement) => void} */
export const closeModal = modal => {
    modal.classList.remove('popup_is-opened');
};

/** @type {(modal: HTMLElement) => HTMLButtonElement} */
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
 */

/**
 * @typedef {object} ModalFromHandlers
 * @property {() => void} onSubmit
 * @property {() => void} onClose
 * @property {() => void} onOpen
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
        openModalButton,
        ...popupElements
    } = elements;

    const { onSubmit, onClose, onOpen } = handlers;

    const { open, close } = initModalHandlers({
        elements: popupElements,
        handlers: {
            onClose,
            onOpen,
        },
    });

    openModalButton.addEventListener('click', open);

    const handleSubmitButtonClick = evt => {
        evt.preventDefault();
        onSubmit();
        close();
    };

    submitFormButton.addEventListener('click', handleSubmitButtonClick);
};

/**
 * @param {ModalElements} param
 * @param {ModalElements} param.elements
 * @param {{ onClose: () => void }} param.handler
 *
 * @returns {{
 *   open: () => void;
 *   close: () => void;
 * }}
 */
export const initModalHandlers = ({ elements, handlers }) => {
    const { closeModalButton, modal } = elements;
    const { onClose, onOpen } = handlers;

    const close = () => {
        closeModal(modal);
        document.removeEventListener('keydown', handleEscapeKeydown);
        onClose();
    };

    closeModalButton.addEventListener('click', close);
    const handleEscapeKeydown = makeKeydownHandler('Escape', close);

    /** @type {(evt: PointerEvent) => void} */
    const handleModalOverlayClick = evt => {
        if (evt.target === modal) {
            close();
        }
    };

    modal.addEventListener('mousedown', handleModalOverlayClick);

    const open = () => {
        onOpen();
        showModal(modal);
        document.addEventListener('keydown', handleEscapeKeydown);
    };

    return { open, close };
};
