"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class UnsupportedGrantTypeError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'unsupported_grant_type' }, properties));
    }
}
exports.UnsupportedGrantTypeError = UnsupportedGrantTypeError;
//# sourceMappingURL=unsupported-grant-type-error.js.map