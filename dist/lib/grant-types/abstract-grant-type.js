"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const tokenUtil = require("../utils/token-util");
const is = require("../validator/is");
class AbstractGrantType {
    constructor(options = {}) {
        if (!options.accessTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.model = options.model;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken;
    }
    async generateAccessToken(client, user, scope) {
        if (this.model.generateAccessToken) {
            const token = await this.model.generateAccessToken(client, user, scope);
            return token ? token : tokenUtil.GenerateRandomToken();
        }
        return tokenUtil.GenerateRandomToken();
    }
    async generateRefreshToken(client, user, scope) {
        if (this.model.generateRefreshToken) {
            const token = await this.model.generateRefreshToken(client, user, scope);
            return token ? token : tokenUtil.GenerateRandomToken();
        }
        return tokenUtil.GenerateRandomToken();
    }
    getAccessTokenExpiresAt() {
        return new Date(Date.now() + this.accessTokenLifetime * constants_1.MILLISECONDS_PER_SECOND);
    }
    getRefreshTokenExpiresAt() {
        return new Date(Date.now() + this.refreshTokenLifetime * constants_1.MILLISECONDS_PER_SECOND);
    }
    getScope(request) {
        if (!is.nqschar(request.body.scope)) {
            throw new errors_1.InvalidArgumentError('Invalid parameter: `scope`');
        }
        return request.body.scope;
    }
    async validateScope(user, client, scope) {
        if (this.model.validateScope) {
            const validatedScope = await this.model.validateScope(user, client, scope);
            if (!validatedScope) {
                throw new errors_1.InvalidScopeError('Invalid scope: Requested scope is invalid');
            }
            return validatedScope;
        }
        return scope;
    }
}
exports.AbstractGrantType = AbstractGrantType;
//# sourceMappingURL=abstract-grant-type.js.map