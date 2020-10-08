"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require("basic-auth");
const errors_1 = require("../errors");
const request_1 = require("../request");
const response_1 = require("../response");
const fn_1 = require("../utils/fn");
const is = require("../validator/is");
class RevokeHandler {
    constructor(options = {}) {
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
        }
        if (!options.model.getRefreshToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getRefreshToken()`');
        }
        if (!options.model.getAccessToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getAccessToken()`');
        }
        if (!options.model.revokeToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `revokeToken()`');
        }
        this.model = options.model;
    }
    async handle(request, response) {
        if (!(request instanceof request_1.Request)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
        }
        if (!(response instanceof response_1.Response)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
        }
        if (request.method !== 'POST') {
            throw new errors_1.InvalidRequestError('Invalid request: method must be POST');
        }
        if (!request.is('application/x-www-form-urlencoded')) {
            throw new errors_1.InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded');
        }
        this.model.request = request;
        try {
            const client = await this.getClient(request, response);
            return this.handleRevokeToken(request, client);
        }
        catch (e) {
            let error = e;
            if (!(error instanceof errors_1.OAuthError)) {
                error = new errors_1.ServerError(error);
            }
            if (!(error instanceof errors_1.InvalidTokenError)) {
                this.updateErrorResponse(response, error);
            }
            throw error;
        }
    }
    async handleRevokeToken(request, client) {
        try {
            let token = await this.getTokenFromRequest(request);
            token = await fn_1.oneSuccess([
                this.getAccessToken(token, client),
                this.getRefreshToken(token, client),
            ]);
            return this.revokeToken(token);
        }
        catch (errors) {
            throw errors;
        }
    }
    async getClient(request, response) {
        const credentials = this.getClientCredentials(request);
        if (!credentials.clientId) {
            throw new errors_1.InvalidRequestError('Missing parameter: `client_id`');
        }
        if (!credentials.clientSecret) {
            throw new errors_1.InvalidRequestError('Missing parameter: `client_secret`');
        }
        if (!is.vschar(credentials.clientId)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `client_id`');
        }
        if (!is.vschar(credentials.clientSecret)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `client_secret`');
        }
        try {
            const client = await this.model.getClient(credentials.clientId, credentials.clientSecret);
            if (!client) {
                throw new errors_1.InvalidClientError('Invalid client: client is invalid');
            }
            if (!client.grants) {
                throw new errors_1.ServerError('Server error: missing client `grants`');
            }
            if (!(client.grants instanceof Array)) {
                throw new errors_1.ServerError('Server error: `grants` must be an array');
            }
            return client;
        }
        catch (e) {
            if (e instanceof errors_1.InvalidClientError && request.get('authorization')) {
                response.set('WWW-Authenticate', 'Basic realm="Service"');
                throw new errors_1.InvalidClientError(e, { code: 401 });
            }
            throw e;
        }
    }
    getClientCredentials(request) {
        const credentials = auth(request);
        if (credentials) {
            return { clientId: credentials.name, clientSecret: credentials.pass };
        }
        if (request.body.client_id && request.body.client_secret) {
            return {
                clientId: request.body.client_id,
                clientSecret: request.body.client_secret,
            };
        }
        throw new errors_1.InvalidClientError('Invalid client: cannot retrieve client credentials');
    }
    getTokenFromRequest(request) {
        const bodyToken = request.body.token;
        if (!bodyToken) {
            throw new errors_1.InvalidRequestError('Missing parameter: `token`');
        }
        return bodyToken;
    }
    async getRefreshToken(token, client) {
        const refreshToken = await this.model.getRefreshToken(token);
        if (!refreshToken) {
            throw new errors_1.InvalidTokenError('Invalid token: refresh token is invalid');
        }
        if (!refreshToken.client) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `client` object');
        }
        if (!refreshToken.user) {
            throw new errors_1.ServerError('Server error: `getRefreshToken()` did not return a `user` object');
        }
        if (refreshToken.client.id !== client.id) {
            throw new errors_1.InvalidClientError('Invalid client: client is invalid');
        }
        if (refreshToken.refreshTokenExpiresAt &&
            !(refreshToken.refreshTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }
        if (refreshToken.refreshTokenExpiresAt &&
            refreshToken.refreshTokenExpiresAt.getTime() < Date.now()) {
            throw new errors_1.InvalidTokenError('Invalid token: refresh token has expired');
        }
        return refreshToken;
    }
    async getAccessToken(token, client) {
        const accessToken = await this.model.getAccessToken(token);
        if (!accessToken) {
            throw new errors_1.InvalidTokenError('Invalid token: access token is invalid');
        }
        if (!accessToken.client) {
            throw new errors_1.ServerError('Server error: `getAccessToken()` did not return a `client` object');
        }
        if (!accessToken.user) {
            throw new errors_1.ServerError('Server error: `getAccessToken()` did not return a `user` object');
        }
        if (accessToken.client.id !== client.id) {
            throw new errors_1.InvalidClientError('Invalid client: client is invalid');
        }
        if (accessToken.accessTokenExpiresAt &&
            !(accessToken.accessTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `expires` must be a Date instance');
        }
        if (accessToken.accessTokenExpiresAt &&
            accessToken.accessTokenExpiresAt.getTime() < Date.now()) {
            throw new errors_1.InvalidTokenError('Invalid token: access token has expired.');
        }
        return accessToken;
    }
    async revokeToken(token) {
        const revokedToken = await this.model.revokeToken(token);
        if (!revokedToken) {
            throw new errors_1.InvalidTokenError('Invalid token: token is invalid');
        }
        return revokedToken;
    }
    updateErrorResponse(response, error) {
        response.body = {
            error: error.name,
            error_description: error.message,
        };
        response.status = error.code;
    }
}
exports.RevokeHandler = RevokeHandler;
//# sourceMappingURL=revoke-handler.js.map