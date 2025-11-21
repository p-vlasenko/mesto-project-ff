export const noop = () => {};

/** @type {<T extends Function[]>(fns:T) => (param: Parameter<T[0]>) => unknown} */
export const flow = (...fns) => param => fns.reduce((result, fn) => fn(result), param);

/** @type {<T, U>(fn: (param: T) => U) => (list: T[]) => U[]} */
export const map = fn => list => list.map(fn);

/** @type {<T>(fn: (param: T) => any) => (param: T) => T} */
export const passthrough = fn => param => {
    fn(param);

    return param;
};

/** @type {<T, U>(predicate: (param: T) => boolean, fn: (param: T) => U) => (param: T) => T | U} */
export const when = (predicate, fn) => param => predicate(param) ? fn(param) : param;

/** @type {(predicate: boolean) => (message: string) => void} */
export const assert = (predicate, message) => {
    if (!predicate) {
        throw new Error(`Assertion error: ${message}`, { });
    }
};

/** @type {(value: unknown) => boolean} */
export const isNil = value => value === null || value === undefined;

/** @type {(text: string) => boolean} */
export const isEmptyText = text => text.trim().length === 0;
