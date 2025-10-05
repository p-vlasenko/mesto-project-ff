import { assert, getFirstElementByClassNameOrFail } from './utils.js';

export const getFormSubmitButton = form => getFirstElementByClassNameOrFail('button', form);

/**
 * @param {string} name
 * @returns {HTMLFormElement}
 */
export const getFormOrFail = name => {
    const form = document.forms[name];
    assert(form instanceof HTMLFormElement, `form with name: ${name} not found`);

    return form;
};

/**
 * @param {HTMLFormElement} form
 * @param {string} elementName
 * @returns {HTMLFormElement}
 */
export const getFromElementOrFail = (form, elementName) => {
    const element = form.elements[elementName];
    assert(element instanceof HTMLElement, `form element with name: ${elementName} not found`);

    return element;
};
