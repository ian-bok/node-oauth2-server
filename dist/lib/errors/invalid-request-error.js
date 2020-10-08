"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidRequestError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_request' }, properties));
    }
}
exports.InvalidRequestError = InvalidRequestError;
//# sourceMappingURL=invalid-request-error.js.map