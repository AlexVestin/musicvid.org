function isPrimitive(test) {
    return test !== Object(test);
}

export default function serialize(obj) {
    let serializedObj;

    if (Array.isArray(obj)) {
        serializedObj = [];
        obj.forEach(attr => {
            if (attr !== undefined) {
                if (isPrimitive(attr)) {
                    serializedObj.push(attr);
                }else {
                    serializedObj.push(serializeObject(attr));
                }
            }
        });
    } else {
        serializedObj = {};
        Object.keys(obj).forEach(key => {
            const attr = obj[key];
            if (attr !== undefined) {
                if (isPrimitive(attr)) {
                    serializedObj[key] = attr;
                }
            }
        });
    }

    return serializedObj;
}

function __serializeRec(obj, sobj) {
    if (obj.__objectsToSerialize) {
        obj.__objectsToSerialize.forEach(key => {
            if (key === "uniforms") {
                const unifs = obj[key];
                const uf = {};
                Object.keys(unifs).forEach(k => {
                    const val = unifs[k].value;
                    if (val !== Object(val)) {
                        uf[k] = val;
                    }
                });
                sobj.__uniforms = uf;
                return;
            }

            sobj[key] = serialize(obj[key]);
            __serializeRec(obj[key], sobj[key]);
        });
    }
}

export function serializeObject(obj) {
    const sobj = serialize(obj);
    __serializeRec(obj, sobj);
    return sobj;
}
