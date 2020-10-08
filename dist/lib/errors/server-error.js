"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_error_1 = require("./oauth-error");
class ServerError extends oauth_error_1.OAuthError {
    constructor(message = '', properties) {
        super(message, Object.assign({ code: 500, name: 'server_error' }, properties));
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=server-error.js.map