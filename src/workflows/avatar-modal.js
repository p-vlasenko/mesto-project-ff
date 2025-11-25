import { initFormModalHandlers } from '../components/modal.js';
import { SAVING_TEXT } from './constants.js';

/**
 * @typedef {import('../components/modal.js').FromElements} FromElements
 * @typedef {import('../components/modal.js').ModalElements} ModalElements
 */

/**
 * @typedef {object} AvatarElements
 * @property {HTMLInputElement} avatarImageInput
 * @property {HTMLImageElement} avatarImageElement
 */

/**
 * @typedef {FromElements & ModalElements & AvatarElements} AvatarWorkflowElements
 */

/** @typedef {import('../types.js').User} User */

/**
 * @typedef {object} AvatarFlowDeps
 * @property {User} user
 * @property {(form: HTMLFormElement) => void} resetValidationErrors
 * @property {(link: string) => Promise<string>} updateAvatar
 * @property {(button: HTMLElement) => void} disableButton
 */

/** @type {(params: ProfileFlowDeps) => (elements: AvatarWorkflowElements) => void} */
export const initAvatarEditModal = deps => elements => {
    const { user, updateAvatar, resetValidationErrors, disableButton } = deps;

    const {
        avatarImageInput,
        avatarImageElement,
        form,
        submitFormButton,
        ...modalFormElements
    } = elements;

    /** @type {(url: string) => void} */
    const setAvatarImage = url => {
        avatarImageElement.style.backgroundImage = `url('${url}')`;
        avatarImageInput.value = url;
    };

    avatarImageInput.value = user.avatar;
    setAvatarImage(user.avatar);

    /** @type {() => Promise<void>} */
    const onSubmit = () => {
        const buttonText = submitFormButton.textContent;
        submitFormButton.textContent = SAVING_TEXT;
        submitFormButton.disabled = true;

        return updateAvatar(avatarImageInput.value)
            .then(setAvatarImage)
            .catch(err => console.error('Avatar update failed', err))
            .finally(() => void (submitFormButton.textContent = buttonText));
    };

    const setInputValues = () => {
        avatarImageInput.value = user.avatar;
    };

    initFormModalHandlers({
        elements: { form, submitFormButton, ...modalFormElements },
        handlers: {
            onSubmit,
            onOpen: () => {
                setInputValues();
                disableButton(submitFormButton);
            },
            onClose: () => resetValidationErrors(form),
        },
    });
};
