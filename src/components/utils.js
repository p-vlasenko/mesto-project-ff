export const noop = () => {};

/** @type {<T extends Function[]>(fns:T) => (param: Parameter<T[0]>) => unknown} */
export const flow = (...fns) => param => fns.reduce((result, fn) => fn(result), param);

/** @type {() => DocumentFragment} */
export const makeFragment = () => document.createDocumentFragment();

/** @type {<T, U>(fn: (param: T) => U) => (list: T[]) => U[]} */
export const map = fn => list => list.map(fn);

/** @type {(container: HTMLElement) => DocumentFragment} */
export const appendTo = container => child => container.appendChild(child);

/** @type {(template: HTMLTemplateElement) => HTMLLiElement} */
export const cloneTemplateContent = template => template.content.cloneNode(true);

/** @type {(className: string) = (container: HTMLElement) => void} */
export const makeClosestElementByClassNameRemover = className => element => element.closest(className).remove();

/** @type {<T>(fn: (param: T) => any) => (param: T) => T} */
export const passthrough = fn => param => {
    fn(param);

    return param;
};

/** @type {(predicate: boolean) => (message: string) => void} */
export const assert = (predicate, message) => {
    if (!predicate) {
        throw new Error(`Assertion error: ${message}`, { });
    }
};

/** @type {(className: string, containerElement: HTMLElement) => () => HTMLElement} */
export const makeStrictFirstElementByClassNameGetter = (className, containerElement) => () =>
    getFirstElementByClassNameOrFail(className, containerElement);

/** @type {(className: string, containerElement: HTMLElement) => HTMLElement} */
export const getFirstElementByClassNameOrFail = (className, containerElement) => {
    const element = containerElement.querySelector(`.${className}`);
    assert(element instanceof HTMLElement, `element with class name: ${className} not found`);

    return element;
};

/** @type {(name: string) => HTMLFormElement} */
export const getFormOrFail = name => {
    const form = document.forms[name];
    assert(form instanceof HTMLFormElement, `form with name: ${name} not found`);

    return form;
};

/** @type {(id: string) => () => HTMLTemplateElement} */
export const makeStrictTemplateElementGetter = id => () => {
    const template = document.getElementById(id);
    assert(template instanceof HTMLTemplateElement, 'template element is not an HTMLTemplateElement');

    return template;
};

/** @type {(elements: HTMLElement[]) => DocumentFragment} elements */
export const wrapToFragment = elements => elements.reduce(
    (fragment, element) => {
        fragment.appendChild(element);

        return fragment;
    },
    makeFragment(),
);

/** @type {(param: { src: string; link: string; }) => (image: HTMLIFrameElement) => void} */
export const setImageAttributes = ({ src, alt }) => image => {
    image.src = src;
    image.alt = alt;
};

/** @type {(text: string) => (image: HTMLIFrameElement) => void} */
export const setText = text => element => {
    element.textContent = text;
};

/** @type {(value: unknown) => boolean} */
export const isNil = value => value === null || value === undefined;

/** @type {(popup: HTMLElement) => void} */
export const showPopup = popup => {
    popup.classList.add('popup_is-opened');
};

/** @type {(popup: HTMLElement) => void} */
export const closePopup = popup => {
    popup.classList.remove('popup_is-opened');
};

/** @type {(key: string, onPress: () => void) => (evt: KeyboardEvent) => void} */
export const makeKeydownHandler = (key, onPress) => evt => {
    if (evt.key === key) {
        onPress();
    };
};

/** @type {(text: string) => boolean} */
export const isEmptyText = text => text.trim().length === 0;

/** @type {(button: HTMLElement) => void} */
export const disableModalButton = button => {
    button.classList.add('popup__button_disabled');
    button.disabled = true;
};

/** @type {(button: HTMLElement) => void} */
export const enableModalButton = button => {
    button.classList.remove('popup__button_disabled');
    button.disabled = false;
};

/** @type {(popupElement: HTMLElement) => HTMLElement} */
export const getModalCloseButton = popup => getFirstElementByClassNameOrFail(
    'popup__close',
    popup,
);

/** @type {(form: HTMLElement) => HTMLElement} */
export const getFormSubmitButton = form => getFirstElementByClassNameOrFail('button', form);
