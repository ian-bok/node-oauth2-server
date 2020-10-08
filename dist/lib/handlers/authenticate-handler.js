"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const request_1 = require("../request");
const response_1 = require("../response");
class AuthenticateHandler {
    constructor(options = {}) {
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getAccessToken) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getAccessToken()`');
        }
        if (options.scope && options.addAcceptedScopesHeader === undefined) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `addAcceptedScopesHeader`');
        }
        if (options.scope && options.addAuthorizedScopesHeader === undefined) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `addAuthorizedScopesHeader`');
        }
        if (options.scope && !options.model.verifyScope) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `verifyScope()`');
        }
        this.addAcceptedScopesHeader = options.addAcceptedScopesHeader;
        this.addAuthorizedScopesHeader = options.addAuthorizedScopesHeader;
        this.allowBearerTokensInQueryString =
            options.allowBearerTokensInQueryString;
        this.model = options.model;
        this.scope = options.scope;
    }
    async handle(request, response) {
        if (!(request instanceof request_1.Request)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `request` must be an instance of Request');
        }
        if (!(response instanceof response_1.Response)) {
            throw new errors_1.InvalidArgumentError('Invalid argument: `response` must be an instance of Response');
        }
        this.model.request = request;
        try {
            let token = await this.getTokenFromRequest(request);
            token = await this.getAccessToken(token);
            this.validateAccessToken(token);
            if (this.scope) {
                await this.verifyScope(token);
            }
            this.updateResponse(response, token);
            return token;
        }
        catch (e) {
            if (e instanceof errors_1.UnauthorizedRequestError) {
                response.set('WWW-Authenticate', 'Bearer realm="Service"');
            }
            if (!(e instanceof errors_1.OAuthError)) {
                throw new errors_1.ServerError(e);
            }
            throw e;
        }
    }
    getTokenFromRequest(request) {
        const headerToken = request.get('Authorization');
        const queryToken = request.query.access_token;
        const bodyToken = request.body.access_token;
        if ([headerToken, queryToken, bodyToken].filter(Boolean).length > 1) {
            throw new errors_1.InvalidRequestError('Invalid request: only one authentication method is allowed');
        }
        if (headerToken) {
            return this.getTokenFromRequestHeader(request);
        }
        if (queryToken) {
            return this.getTokenFromRequestQuery(request);
        }
        if (bodyToken) {
            return this.getTokenFromRequestBody(request);
        }
        throw new errors_1.UnauthorizedRequestError('Unauthorized request: no authentication given');
    }
    getTokenFromRequestHeader(request) {
        const token = request.get('Authorization');
        const matches = token.match(/Bearer\s(\S+)/);
        if (!matches) {
            throw new errors_1.InvalidRequestError('Invalid request: malformed authorization header');
        }
        return matches[1];
    }
    getTokenFromRequestQuery(request) {
        if (!this.allowBearerTokensInQueryString) {
            throw new errors_1.InvalidRequestError('Invalid request: do not send bearer tokens in query URLs');
        }
        return request.query.access_token;
    }
    getTokenFromRequestBody(request) {
        if (request.method === 'GET') {
            throw new errors_1.InvalidRequestError('Invalid request: token may not be passed in the body when using the GET verb');
        }
        if (!request.is('application/x-www-form-urlencoded')) {
            throw new errors_1.InvalidRequestError('Invalid request: content must be application/x-www-form-urlencoded');
        }
        return request.body.access_token;
    }
    async getAccessToken(token) {
        const accessToken = await this.model.getAccessToken(token);
        if (!accessToken) {
            throw new errors_1.InvalidTokenError('Invalid token: access token is invalid');
        }
        if (!accessToken.user) {
            throw new errors_1.ServerError('Server error: `getAccessToken()` did not return a `user` object');
        }
        return accessToken;
    }
    validateAccessToken(accessToken) {
        if (!(accessToken.accessTokenExpiresAt instanceof Date)) {
            throw new errors_1.ServerError('Server error: `accessTokenExpiresAt` must be a Date instance');
        }
        if (accessToken.accessTokenExpiresAt.getTime() < Date.now()) {
            throw new errors_1.InvalidTokenError('Invalid token: access token has expired');
        }
        return accessToken;
    }
    async verifyScope(accessToken) {
        const scope = await this.model.verifyScope(accessToken, this.scope);
        if (!scope) {
            throw new errors_1.InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
        }
        return scope;
    }
    updateResponse(response, accessToken) {
        if (this.scope && this.addAcceptedScopesHeader) {
            response.set('X-Accepted-OAuth-Scopes', this.scope);
        }
        if (this.scope && this.addAuthorizedScopesHeader) {
            response.set('X-OAuth-Scopes', accessToken.scope);
        }
    }
}
exports.AuthenticateHandler = AuthenticateHandler;
//# sourceMappingURL=authenticate-handler.js.map