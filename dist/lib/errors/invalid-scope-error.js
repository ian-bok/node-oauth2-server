"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class InvalidScopeError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'invalid_scope' }, properties));
    }
}
exports.InvalidScopeError = InvalidScopeError;
//# sourceMappingURL=invalid-scope-error.js.map