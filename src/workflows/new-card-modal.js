import { initFormModalHandlers } from '../components/modal.js';
import { makeCardElement } from '../components/card.js';
import { noop } from '../utils/utils.js';

/**
 * @typedef {import('./types.js').CardWorkflowElements} CardWorkflowElements
 */

/** @type {(handlers: { resetValidationErrors: (form: HTMLFormElement) => void }) => (elements: CardWorkflowElements) => void} */
export const initNewCardModal = ({ resetValidationErrors }) => elements => {
    const {
        submitNewCardFormButton,
        placeNameInput,
        linkInput,
        placesListElement,
        newCardFrom,
        newCardModal,
        addCardButton,
        closeNewCardModalButton,
    } = elements;

    const onNewCardFromSubmit = () => {
        const newCardElement = makeCardElement({
            name: placeNameInput.value,
            link: linkInput.value,
        });

        placesListElement.prepend(newCardElement);
        newCardFrom.reset();
    };

    initFormModalHandlers({
        elements: {
            submitFormButton: submitNewCardFormButton,
            form: newCardFrom,
            openModalButton: addCardButton,
            modal: newCardModal,
            closeModalButton: closeNewCardModalButton,
        },
        handlers: {
            onSubmit: onNewCardFromSubmit,
            onClose: () => {
                newCardFrom.reset();
                resetValidationErrors(newCardFrom);
            },
            onOpen: noop,
        },
    });
};
