"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const handlers_1 = require("./handlers");
class OAuth2Server {
    constructor(options = {}) {
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        this.options = options;
    }
    async authenticate(request, response, options) {
        let opt = options;
        if (typeof opt === 'string') {
            opt = { scope: opt };
        }
        opt = Object.assign(Object.assign({ addAcceptedScopesHeader: true, addAuthorizedScopesHeader: true, allowBearerTokensInQueryString: false }, this.options), opt);
        return new handlers_1.AuthenticateHandler(opt).handle(request, response);
    }
    async authorize(request, response, options) {
        const opts = Object.assign(Object.assign({ allowEmptyState: false, accessTokenLifetime: constants_1.HOUR / constants_1.SECOND, authorizationCodeLifetime: (constants_1.MINUTE * 5) / constants_1.SECOND }, this.options), options);
        return new handlers_1.AuthorizeHandler(opts).handle(request, response);
    }
    async token(request, response, options) {
        const opts = Object.assign(Object.assign({ accessTokenLifetime: constants_1.HOUR / constants_1.SECOND, refreshTokenLifetime: (constants_1.WEEK * 2) / constants_1.SECOND, allowExtendedTokenAttributes: false, requireClientAuthentication: {} }, this.options), options);
        return new handlers_1.TokenHandler(opts).handle(request, response);
    }
    async revoke(request, response, options) {
        const opt = Object.assign(Object.assign({}, this.options), options);
        return new handlers_1.RevokeHandler(opt).handle(request, response);
    }
}
exports.OAuth2Server = OAuth2Server;
//# sourceMappingURL=server.js.map