export const noop = () => {};

/**
 * @param {Function[]} fns
 * @param param - first function parameter
 * @returns
 */
export const flow = (...fns) => param => fns.reduce((result, fn) => fn(result), param);

/**
 * @returns {DocumentFragment}
 */
export const makeFragment = () => document.createDocumentFragment();

/**
 * @param {(param: T) => U} fn
 * @returns {(list: Array<T>) => Array<U>}
 */
export const map = fn => list => list.map(fn);

/**
 * @param {HTMLElement} container
 * @returns {DocumentFragment}
 */
export const appendTo = container => child => container.appendChild(child);

/**
 *
 * @param {HTMLTemplateElement} template
 * @returns {HTMLLiElement}
 */
export const cloneTemplateContent = template => template.content.cloneNode(true);

/**
 * @param {HTMLButtonElement}
 */
export const makeClosestElementByClassNameRemover = className => element => element.closest(className).remove();

export const passthrough = fn => param => {
    fn(param);

    return param;
};

/**
 *
 * @param {boolean} predicate
 * @param {string} message
 *
 * @returns {void}
 */
export const assert = (predicate, message) => {
    if (!predicate) {
        throw new Error(`Assertion error: ${message}`, { });
    }
};

/**
 * @param {string} className
 * @param {HTMLElement} containerElement
 * @returns {() => HTMLElement}
 */
export const makeStrictFirstElementByClassNameGetter = (className, containerElement) => () =>
    getFirstElementByClassNameOrFail(className, containerElement);

/**
 * @param {string} className
 * @param {HTMLElement} containerElement
 * @returns {HTMLElement}
 */
export const getFirstElementByClassNameOrFail = (className, containerElement) => {
    const element = containerElement.querySelector(`.${className}`);
    assert(element instanceof HTMLElement, `element with class name: ${className} not found`);

    return element;
};

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

/**
 * @param {string} id
 * @returns {() => HTMLTemplateElement}
 */
export const makeStrictTemplateElementGetter = id => () => {
    const template = document.getElementById(id);
    assert(template instanceof HTMLTemplateElement, 'template element is not an HTMLTemplateElement');

    return template;
};

/**
 *
 * @param {HTMLElement[]} elements
 * @returns {DocumentFragment}
 */
export const wrapToFragment = elements => elements.reduce(
    (fragment, element) => {
        fragment.appendChild(element);

        return fragment;
    },
    makeFragment(),
);

/**
 *
 * @param {object} param
 * @param {string} param.src
 * @param {string} param.alt
 *
 * @returns {(image: HTMLIFrameElement) => void}
 */
export const setImageAttributes = ({ src, alt }) => image => {
    image.src = src;
    image.alt = alt;
};

/**
 *
 * @param {string} text
 * @returns {(image: HTMLIFrameElement) => void}
 */
export const setText = text => element => {
    element.textContent = text;
};

/**
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export const isNil = value => value === null || value === undefined;

/**
 * @param {HTMLElement} popup
 */
export const showPopup = popup => {
    popup.classList.add('popup_is-opened');
};

/**
 * @param {HTMLElement} popup
 */
export const closePopup = popup => {
    popup.classList.remove('popup_is-opened');
};

export const makeKeydownHandler = (key, onPress) => evt => {
    if (evt.key === key) {
        onPress();
    };
};

export const isEmptyText = text => text.trim().length === 0;

export const disablePopupButton = button => {
    button.classList.add('popup__button_disabled');
    button.disabled = true;
};

export const enablePopupButton = button => {
    button.classList.remove('popup__button_disabled');
    button.disabled = false;
};

export const getPopupCloseButton = popupElement => getFirstElementByClassNameOrFail(
    'popup__close',
    popupElement,
);

export const getFormSubmitButton = form => getFirstElementByClassNameOrFail('button', form);
