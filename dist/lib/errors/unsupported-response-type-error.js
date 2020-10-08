"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class UnsupportedResponseTypeError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'unsupported_response_type' }, properties));
    }
}
exports.UnsupportedResponseTypeError = UnsupportedResponseTypeError;
//# sourceMappingURL=unsupported-response-type-error.js.map