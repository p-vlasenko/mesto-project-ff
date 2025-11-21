import { assert } from './utils';

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

/** @type {(key: string, onPress: () => void) => (evt: KeyboardEvent) => void} */
export const makeKeydownHandler = (key, onPress) => evt => {
    if (evt.key === key) {
        onPress();
    };
};

/** @type {(container: HTMLElement) => DocumentFragment} */
export const appendTo = container => child => container.appendChild(child);

/** @type {(template: HTMLTemplateElement) => DocumentFragment} */
export const cloneTemplateContent = template => template.content.cloneNode(true);

/** @type {(fragment: DocumentFragment) => DocumentFragment} */
export const getFirstChild = fragment => fragment.firstElementChild;

/** @type {(className: string) = (container: HTMLElement) => void} */
export const makeClosestElementByClassNameRemover = className => element => element.closest(className).remove();

/** @type {() => DocumentFragment} */
export const makeFragment = () => document.createDocumentFragment();

export const getFormSubmitButton = form => getFirstElementByClassNameOrFail('button', form);

/**
 * @type {(form: HTMLFormElement, elementName: string) => HTMLFormElement}
 */
export const getFromElementOrFail = (form, elementName) => {
    const element = form.elements[elementName];
    assert(element instanceof HTMLElement, `form element with name: ${elementName} not found`);

    return element;
};
