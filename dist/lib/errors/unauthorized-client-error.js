"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class UnauthorizedClientError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 400, name: 'unauthorized_client' }, properties));
    }
}
exports.UnauthorizedClientError = UnauthorizedClientError;
//# sourceMappingURL=unauthorized-client-error.js.map