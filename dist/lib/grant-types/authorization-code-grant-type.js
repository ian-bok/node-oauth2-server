"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
const is = require("../validator/is");
const crypto = require("crypto");
const stringUtil = require("../utils/string-util");
class AuthorizationCodeGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getAuthorizationCode()`');
        }
        if (!options.model.revokeAuthorizationCode) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `revokeAuthorizationCode()`');
        }
        if (!options.model.saveToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `saveToken()`');
        }
    }
    async handle(request, client) {
        if (!request) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `request`');
        }
        if (!client) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `client`');
        }
        const code = await this.getAuthorizationCode(request, client);
        this.validateRedirectUri(request, code);
        await this.revokeAuthorizationCode(code);
        return this.saveToken(code.user, client, code.authorizationCode, code.scope);
    }
    async getAuthorizationCode(request, client) {
        if (!request.body.code) {
            throw new errors_1.InvalidRequestError('Missing parameter: `code`');
        }
        if (!is.vschar(request.body.code)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `code`');
        }
        const code = await this.model.getAuthorizationCode(request.body.code);
        if (!code) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        if (!code.client) {
            throw new errors_1.ServerError('Server error: `getAuthorizationCode()` did not return a `client` object');
        }
        if (!code.user) {
            throw new errors_1.ServerError('Server error: `getAuthorizationCode()` did not return a `user` object');
        }
        if (code.client.id !== client.id) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        if (!(code.expiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `expiresAt` must be a Date instance');
        }
        if (code.expiresAt.getTime() < Date.now()) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code has expired');
        }
        if (code.redirectUri && !is.uri(code.redirectUri)) {
            throw new errors_1.InvalidGrantError('Invalid grant: `redirect_uri` is not a valid URI');
        }
        if (code.codeChallenge) {
            if (!request.body.code_verifier) {
                throw new errors_1.InvalidGrantError('Missing parameter: `code_verifier`');
            }
            let hash;
            switch (code.codeChallengeMethod) {
                case 'plain':
                    hash = request.body.code_verifier;
                    break;
                case 'S256':
                    hash = stringUtil.base64URLEncode(crypto.createHash('sha256').update(request.body.code_verifier).digest());
                    break;
                default:
                    throw new errors_1.ServerError('Server error: `getAuthorizationCode()` did not return a valid `codeChallengeMethod` property');
            }
            if (code.codeChallenge !== hash) {
                throw new errors_1.InvalidGrantError('Invalid grant: code verifier is invalid');
            }
        }
        else {
            if (request.body.code_verifier) {
                throw new errors_1.InvalidGrantError('Invalid grant: code verifier is invalid');
            }
        }
        return code;
    }
    validateRedirectUri(request, code) {
        if (!code.redirectUri) {
            return;
        }
        const redirectUri = request.body.redirect_uri || request.query.redirect_uri;
        if (!is.uri(redirectUri)) {
            throw new errors_1.InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI');
        }
        if (redirectUri !== code.redirectUri) {
            throw new errors_1.InvalidRequestError('Invalid request: `redirect_uri` is invalid');
        }
    }
    async revokeAuthorizationCode(code) {
        const status = await this.model.revokeAuthorizationCode(code);
        if (!status) {
            throw new errors_1.InvalidGrantError('Invalid grant: authorization code is invalid');
        }
        return code;
    }
    async saveToken(user, client, authorizationCode, scope) {
        const accessScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const refreshToken = await this.generateRefreshToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
        const token = {
            accessToken,
            authorizationCode,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            scope: accessScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.AuthorizationCodeGrantType = AuthorizationCodeGrantType;
//# sourceMappingURL=authorization-code-grant-type.js.map