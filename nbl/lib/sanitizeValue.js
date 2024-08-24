function sanitizeValue(value, defaultValue) {
    if(value === null || value === undefined) {
        return defaultValue;
    }

    return value
}

module.exports = { sanitizeValue };