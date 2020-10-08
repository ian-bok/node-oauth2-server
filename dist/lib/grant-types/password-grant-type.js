"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
const is = require("../validator/is");
class PasswordGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getUser) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getUser()`');
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
        const scope = this.getScope(request);
        const user = await this.getUser(request);
        return this.saveToken(user, client, scope);
    }
    async getUser(request) {
        if (!request.body.username) {
            throw new errors_1.InvalidRequestError('Missing parameter: `username`');
        }
        if (!request.body.password) {
            throw new errors_1.InvalidRequestError('Missing parameter: `password`');
        }
        if (!is.uchar(request.body.username)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `username`');
        }
        if (!is.uchar(request.body.password)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `password`');
        }
        const user = await this.model.getUser(request.body.username, request.body.password);
        if (!user) {
            throw new errors_1.InvalidGrantError('Invalid grant: user credentials are invalid');
        }
        return user;
    }
    async saveToken(user, client, scope) {
        const accessScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const refreshToken = await this.generateRefreshToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
        const token = {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            scope: accessScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.PasswordGrantType = PasswordGrantType;
//# sourceMappingURL=password-grant-type.js.map