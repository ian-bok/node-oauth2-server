"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statuses = require("statuses");
class OAuthError extends Error {
    constructor(messageOrError, properties = {}) {
        super();
        let message = messageOrError instanceof Error ? messageOrError.message : messageOrError;
        const error = messageOrError instanceof Error ? messageOrError : undefined;
        let props = {};
        props = properties;
        props.code = props.code || 500;
        if (error) {
            props.inner = error;
        }
        if (!message) {
            message = statuses[props.code];
        }
        this.code = this.status = this.statusCode = props.code;
        this.message = message;
        const ignoreAttr = ['code', 'message'];
        Object.keys(props)
            .filter(key => !ignoreAttr.includes(key))
            .forEach(key => (this[key] = props[key]));
        Error.captureStackTrace(this, OAuthError);
    }
}
exports.OAuthError = OAuthError;
//# sourceMappingURL=oauth-error.js.map