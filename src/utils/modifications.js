const mongoose = require("mongoose");

const blockedKeys = ["_id", "_doc", "$__", "$op", "$init", "$locals", "_v", "v", "__v", "errors"];

const _deconstruct = (value, key, keyValuePairs = []) => {
    if (!value && value !== false) {
        return keyValuePairs;
    } else if (
        (value.toString().length === 24 && mongoose.isValidObjectId(value)) ||
        value.toDateString
    ) {
        keyValuePairs.push({ key: key || "", value });
        return keyValuePairs;
    } else if (Array.isArray(value)) {
        const deconstructed = [];

        value.forEach((_value, i) => {
            const newKey = key ? `${key}.${i}` : i.toString();
            const _deconstructed = _deconstruct(_value, newKey);
            deconstructed.push(..._deconstructed);
        });
        return deconstructed;
    } else if (value.toObject || typeof value === "object") {
        const keys = Object.keys(value.toObject ? value.toObject() : value);
        const values = Object.values(value.toObject ? value.toObject() : value);
        const deconstructed = [];

        keys.forEach((_key, i) => {
            if (!blockedKeys.includes(_key)) {
                const newKey = `${key ? key + "." : ""}${_key}`;
                const _deconstructed = _deconstruct(values[i], newKey);

                deconstructed.push(..._deconstructed);
            }
        });
        return deconstructed;
    }
    keyValuePairs.push({ key: key || "", value });
    return keyValuePairs;
};

const deconstruct = (object) => {
    const deconstructed = _deconstruct(object);
    const finalObject = {};

    deconstructed.forEach((e) => {
        finalObject[e.key] = e.value;
    });

    return finalObject;
};

const detectModifications = (_newObject, _oldObject) => {
    const newObject = _newObject ? deconstruct(_newObject) : {};
    const oldObject = _oldObject ? deconstruct(_oldObject) : {};

    const newKeys = Object.keys(newObject);
    const oldKeys = Object.keys(oldObject);
    const keys = Array.from(new Set([...newKeys, ...oldKeys]));

    const changes = [];

    keys.forEach((key) => {
        if (
            !oldObject[key] ||
            !newObject[key] ||
            oldObject[key].toString() !== newObject[key].toString()
        ) {
            changes.push({
                field_name: key,
                old_value: oldObject[key]?.toString() || "",
                new_value: newObject[key]?.toString() || "",
            });
        }
    });

    return changes;
};

module.exports = {
    detectModifications,
};
