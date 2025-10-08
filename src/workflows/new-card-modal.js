import { initFormModalHandlers } from '../components/modal.js';
import { makeCardElement } from '../components/card.js';
import {
    isEmptyText,
    noop,
} from '../utils/utils.js';

/**
 * @typedef {import('./types.js').CardWorkflowElements} CardWorkflowElements
 */

/** @type {(elements: CardWorkflowElements) => void} */
export const initNewCardModal = elements => {
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

    const newCardInputs = [placeNameInput, linkInput];

    const isNewCardFormValid = () => newCardInputs.every(input => !isEmptyText(input.value));

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
            inputs: newCardInputs,
            submitFormButton: submitNewCardFormButton,
            form: newCardFrom,
            openModalButton: addCardButton,
            modal: newCardModal,
            closeModalButton: closeNewCardModalButton,
        },
        handlers: {
            isFormValid: isNewCardFormValid,
            onSubmit: onNewCardFromSubmit,
            onClose: () => newCardFrom.reset(),
            onOpen: noop,
        },
    });
};
