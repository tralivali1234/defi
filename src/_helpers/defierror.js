/* eslint-disable prefer-template, max-len */
const bindingErrorPrefix = 'Binding error:';
const calcErrorPrefix = 'Calc error:';
const eventsErrorPrefix = 'Events error:';

const getType = (variable) => {
    if (variable === null) {
        return 'null';
    }

    return typeof variable;
};
const getTypeError = (variable, variableName, expectedType) =>
    `${variableName} must have type "${expectedType}" but got "${getType(variable)}" instead.`;

const errors = {
    'common:object_type': ({ object, method }) => `Error in ${method}: `
        + getTypeError(object, 'object', 'object'),

    'binding:node_missing': ({ key, node }) => {
        const selectorInfo = typeof node === 'string' ? ` (given selector is "${node}")` : '';
        return `${bindingErrorPrefix} node is missing for key "${key}"${selectorInfo}.`;
    },
    'binding:falsy_key': () => `${bindingErrorPrefix} "key" arg cannot be falsy`,
    'calc:target_type': ({ target }) =>
        `${calcErrorPrefix} ${getTypeError(target, 'target key', 'string')}`,
    'calc:source_key_type': ({ sourceKey }) =>
        `${calcErrorPrefix} ${getTypeError(sourceKey, 'source key', 'string')}`,
    'calc:source_object_type': ({ sourceObject }) =>
        `${calcErrorPrefix} ${getTypeError(sourceObject, 'source object', 'object')}`,
    'calc:source_type': ({ source }) =>
        `${calcErrorPrefix} ${getTypeError(source, 'source', 'object')}`,

    'trigger:names_type': ({ names }) =>
        `${eventsErrorPrefix} ${getTypeError(names, 'event name', 'string')}`,

    'on:names_type': ({ names }) => errors['trigger:names_type']({ names }),

    'remove:key_type': ({ key }) =>
        `Error in remove: ${getTypeError(key, 'key', 'string')}`,

    'mediate:key_type': ({ key }) =>
        `Error in mediate: ${getTypeError(key, 'key', 'string')}`
};

export default function defiError(key, data) {
    const getError = errors[key];
    if (!getError) {
        /* istanbul ignore next */
        throw Error(`Unknown error "${key}". Please report about this on Github.`);
    }

    return new Error(getError(data));
}
