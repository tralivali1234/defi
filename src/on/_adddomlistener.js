import initDefi from '../_core/init';
import defineProp from '../_core/defineprop';
import addListener from './_addlistener';
import $ from '../_mq';
import createDomEventHandler from './_createdomeventhandler';

// returns an object with event handlers used at addDomListener
function createBindingHandlers({
    fullEventName,
    domEventHandler,
    selector
}) {
    return {
        bindHandler(evt = {}) {
            const { node } = evt;
            if (node) {
                $(node).on(fullEventName, selector, domEventHandler);
            }
        },
        unbindHandler(evt = {}) {
            const { node } = evt;
            if (node) {
                $(node).off(fullEventName, selector, domEventHandler);
            }
        }
    };
}

// adds DOM event listener for nodes bound to given property
export default function addDomListener(object, key, eventName, selector, callback, info) {
    const def = initDefi(object);
    const propDef = defineProp(object, key);

    const domEventHandler = createDomEventHandler({
        key,
        object,
        callback
    });

    // making possible to remove this event listener
    domEventHandler._callback = callback;

    const eventNamespace = def.id + key;
    const fullEventName = `${eventName}.${eventNamespace}`;
    const { bindHandler, unbindHandler } = createBindingHandlers({
        fullEventName,
        domEventHandler,
        selector
    });
    const addBindListenerResult
        = addListener(object, `bind:${key}`, bindHandler, info);
    const addUnbindListenerResult
        = addListener(object, `unbind:${key}`, unbindHandler, info);

    // if events are added successfully then run bindHandler for every node immediately
    // TODO: Describe why do we need addBindListenerResult and addUnbindListenerResult
    if (addBindListenerResult && addUnbindListenerResult) {
        const { bindings } = propDef;
        if (bindings) {
            nofn.forEach(bindings, ({ node }) => bindHandler({ node }));
        }
    }

    return object;
}
