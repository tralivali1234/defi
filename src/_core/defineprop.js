import defs from './defs';
import set from '../set';

// the function defines needed descriptor for given property
export default function defineProp(object, key, noAccessor) {
    const def = defs.get(object);

    // if no object definition do nothing
    if (!def) {
        return null;
    }

    if (!def.props[key]) {
        const propDef = def.props[key] = {
            value: object[key],
            mediator: null,
            bindings: null
        };

        if (!noAccessor) {
            Object.defineProperty(object, key, {
                configurable: true,
                enumerable: true,
                get() {
                    return propDef.value;
                },
                set(v) {
                    return set(object, key, v, {
                        fromSetter: true
                    });
                }
            });
        }
    }

    return def.props[key];
}
