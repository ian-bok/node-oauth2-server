"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const tokenUtil = require("../utils/token-util");
class CodeResponseType {
    constructor(options = {}) {
        if (!options.authorizationCodeLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `authorizationCodeLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.saveAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveAuthorizationCode()`');
        }
        this.code = undefined;
        this.authorizationCodeLifetime = options.authorizationCodeLifetime;
        this.model = options.model;
    }
    async handle(request, client, user, uri, scope) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        if (!user) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `user`');
        }
        if (!uri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `uri`');
        }
        const codeChallenge = this.getCodeChallenge(request);
        const codeChallengeMethod = this.getCodeChallengeMethod(request);
        if (!codeChallenge && codeChallengeMethod) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `code_challenge`');
        }
        const authorizationCode = await this.generateAuthorizationCode(client, user, scope);
        const expiresAt = this.getAuthorizationCodeExpiresAt(client);
        const code = await this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user, codeChallenge, codeChallengeMethod);
        this.code = code.authorizationCode;
        return code;
    }
    getAuthorizationCodeExpiresAt(client) {
        const authorizationCodeLifetime = this.getAuthorizationCodeLifetime(client);
        return new Date(Date.now() + authorizationCodeLifetime * constants_1.MILLISECONDS_PER_SECOND);
    }
    getAuthorizationCodeLifetime(client) {
        return client.authorizationCodeLifetime || this.authorizationCodeLifetime;
    }
    async saveAuthorizationCode(authorizationCode, expiresAt, scope, client, redirectUri, user, codeChallenge, codeChallengeMethod) {
        const code = {
            authorizationCode,
            expiresAt,
            redirectUri,
            scope,
        };
        if (codeChallenge) {
            code.codeChallenge = codeChallenge;
            code.codeChallengeMethod = codeChallengeMethod || 'plain';
        }
        return this.model.saveAuthorizationCode(code, client, user);
    }
    async generateAuthorizationCode(client, user, scope) {
        if (this.model.generateAuthorizationCode) {
            return this.model.generateAuthorizationCode(client, user, scope);
        }
        return tokenUtil.GenerateRandomToken();
    }
    buildRedirectUri(redirectUri) {
        if (!redirectUri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `redirectUri`');
        }
        redirectUri.search = undefined;
        return this.setRedirectUriParam(redirectUri, 'code', this.code);
    }
    setRedirectUriParam(redirectUri, key, value) {
        if (!redirectUri) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `redirectUri`');
        }
        if (!key) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `key`');
        }
        redirectUri.query = redirectUri.query || {};
        redirectUri.query[key] = value;
        return redirectUri;
    }
    getCodeChallenge(request) {
        const codeChallenge = request.body.code_challenge || request.query.code_challenge;
        if (!codeChallenge) {
            return undefined;
        }
        if (!codeChallenge.match(/^([A-Za-z0-9\.\-\_\~]){43,128}$/)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `code_challenge`');
        }
        return codeChallenge;
    }
    getCodeChallengeMethod(request) {
        const codeChallengeMethod = request.body.code_challenge_method || request.query.code_challenge_method;
        if (!codeChallengeMethod) {
            return undefined;
        }
        if (codeChallengeMethod !== 'S256' && codeChallengeMethod !== 'plain') {
            throw new errors_1.InvalidRequestError('Invalid parameter: `code_challenge_method`');
        }
        return codeChallengeMethod;
    }
}
exports.CodeResponseType = CodeResponseType;
//# sourceMappingURL=code-response-type.js.map