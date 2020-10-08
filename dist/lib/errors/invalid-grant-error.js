"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidGrantError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_grant' }, properties));
    }
}
exports.InvalidGrantError = InvalidGrantError;
//# sourceMappingURL=invalid-grant-error.js.map