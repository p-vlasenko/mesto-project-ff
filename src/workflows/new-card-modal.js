import { makeCardElement } from '../components/card.js';
import { initFormModalHandlers } from '../components/modal.js';
import { noop } from '../utils/utils.js';
import { DEFAULT_SAVE_BUTTON_TEXT, SAVING_TEXT } from './constants.js';

/** @typedef {import('./types.js').CardWorkflowElements} CardWorkflowElements */
/** @typedef {import('../types.js').Card} Card */
/** @typedef {import('../types.js').User} User */

/**
 * @typedef {import('./types.js').CardWorkflowElements} NewCardWorkflowDeps
 * @property {User} user
 * @property {(params: Pick<Card, 'name' | 'link'>) => Promise<Card>} addCard
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 */

/** @type {(deps: { resetValidationErrors: (form: HTMLFormElement) => void }) => (elements: CardWorkflowElements) => void} */
export const initNewCardModal = ({ resetValidationErrors, addCard, user }) => elements => {
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

    const onSubmit = () => {
        submitNewCardFormButton.textContent = SAVING_TEXT;

        return addCard({
            name: placeNameInput.value,
            link: linkInput.value,
        }).then(card => {
            const newCardElement = makeCardElement(card, user);
            placesListElement.prepend(newCardElement);
            newCardFrom.reset();
        }).catch(
            err => console.error('Card adding failed', err),
        ).finally(() => {
            submitNewCardFormButton.textContent = DEFAULT_SAVE_BUTTON_TEXT;
        });
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
            onSubmit,
            onClose: () => {
                newCardFrom.reset();
                resetValidationErrors(newCardFrom);
            },
            onOpen: noop,
        },
    });
};
