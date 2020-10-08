"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidTokenError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 401, name: 'invalid_token' }, properties));
    }
}
exports.InvalidTokenError = InvalidTokenError;
//# sourceMappingURL=invalid-token-error.js.map