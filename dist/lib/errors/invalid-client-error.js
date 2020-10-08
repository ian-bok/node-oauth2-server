"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidClientError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_client' }, properties));
    }
}
exports.InvalidClientError = InvalidClientError;
//# sourceMappingURL=invalid-client-error.js.map