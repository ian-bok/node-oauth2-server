"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require("basic-auth");
const errors_1 = require("../errors");
const grant_types_1 = require("../grant-types");
const models_1 = require("../models");
const request_1 = require("../request");
const response_1 = require("../response");
const token_types_1 = require("../token-types");
const fn_1 = require("../utils/fn");
const is = require("../validator/is");
const grantTypes = {
    authorization_code: grant_types_1.AuthorizationCodeGrantType,
    client_credentials: grant_types_1.ClientCredentialsGrantType,
    password: grant_types_1.PasswordGrantType,
    refresh_token: grant_types_1.RefreshTokenGrantType,
};
class TokenHandler {
    constructor(options = {}) {
        if (!options.accessTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `accessTokenLifetime`');
        }
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.refreshTokenLifetime) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `refreshTokenLifetime`');
        }
        if (!options.model.getClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getClient()`');
        }
        this.accessTokenLifetime = options.accessTokenLifetime;
        this.grantTypes = Object.assign(Object.assign({}, grantTypes), options.extendedGrantTypes);
        this.model = options.model;
        this.refreshTokenLifetime = options.refreshTokenLifetime;
        this.allowExtendedTokenAttributes = options.allowExtendedTokenAttributes;
        this.requireClientAuthentication =
            options.requireClientAuthentication || {};
        this.alwaysIssueNewRefreshToken =
            options.alwaysIssueNewRefreshToken !== false;
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
            const data = await this.handleGrantType(request, client);
            const model = new models_1.TokenModel(data, {
                allowExtendedTokenAttributes: this.allowExtendedTokenAttributes,
            });
            const tokenType = this.getTokenType(model);
            this.updateSuccessResponse(response, tokenType);
            return data;
        }
        catch (e) {
            if (!(e instanceof errors_1.OAuthError)) {
                e = new errors_1.ServerError(e);
            }
            this.updateErrorResponse(response, e);
            throw e;
        }
    }
    async getClient(request, response) {
        const credentials = this.getClientCredentials(request);
        const grantType = request.body.grant_type;
        const isPkce = this.isPKCERequest(request, grantType);
        if (!credentials.clientId) {
            throw new errors_1.InvalidRequestError('Missing parameter: `client_id`');
        }
        if (this.isClientAuthenticationRequired(grantType) &&
            !credentials.clientSecret &&
            !isPkce) {
            throw new errors_1.InvalidRequestError('Missing parameter: `client_secret`');
        }
        if (!is.vschar(credentials.clientId)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `client_id`');
        }
        if (credentials.clientSecret && !is.vschar(credentials.clientSecret)) {
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
        const grantType = request.body.grant_type;
        if (credentials) {
            return {
                clientId: credentials.name,
                clientSecret: credentials.pass,
            };
        }
        if (request.body.client_id && request.body.client_secret) {
            return {
                clientId: request.body.client_id,
                clientSecret: request.body.client_secret,
            };
        }
        if (this.isPKCERequest(request, grantType)) {
            if (request.body.client_id) {
                return { clientId: request.body.client_id };
            }
        }
        if (!this.isClientAuthenticationRequired(grantType) &&
            request.body.client_id) {
            return { clientId: request.body.client_id };
        }
        throw new errors_1.InvalidClientError('Invalid client: cannot retrieve client credentials');
    }
    async handleGrantType(request, client) {
        const grantType = request.body.grant_type;
        if (!grantType) {
            throw new errors_1.InvalidRequestError('Missing parameter: `grant_type`');
        }
        if (!is.nchar(grantType) && !is.uri(grantType)) {
            throw new errors_1.InvalidRequestError('Invalid parameter: `grant_type`');
        }
        if (!fn_1.hasOwnProperty(this.grantTypes, grantType)) {
            throw new errors_1.UnsupportedGrantTypeError('Unsupported grant type: `grant_type` is invalid');
        }
        if (!client.grants.includes(grantType)) {
            throw new errors_1.UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
        }
        const accessTokenLifetime = this.getAccessTokenLifetime(client);
        const refreshTokenLifetime = this.getRefreshTokenLifetime(client);
        const GrantType = this.grantTypes[grantType];
        const options = {
            accessTokenLifetime,
            model: this.model,
            refreshTokenLifetime,
            alwaysIssueNewRefreshToken: this.alwaysIssueNewRefreshToken,
        };
        return new GrantType(options).handle(request, client);
    }
    getAccessTokenLifetime(client) {
        return client.accessTokenLifetime || this.accessTokenLifetime;
    }
    getRefreshTokenLifetime(client) {
        return client.refreshTokenLifetime || this.refreshTokenLifetime;
    }
    getTokenType(model) {
        return new token_types_1.BearerTokenType(model.accessToken, model.accessTokenLifetime, model.refreshToken, model.scope, model.customAttributes);
    }
    updateSuccessResponse(response, tokenType) {
        response.body = tokenType.valueOf();
        response.set('Cache-Control', 'no-store');
        response.set('Pragma', 'no-cache');
    }
    updateErrorResponse(response, error) {
        response.body = {
            error: error.name,
            error_description: error.message,
        };
        response.status = error.code;
    }
    isClientAuthenticationRequired(grantType) {
        if (Object.keys(this.requireClientAuthentication).length > 0) {
            return typeof this.requireClientAuthentication[grantType] !== 'undefined'
                ? this.requireClientAuthentication[grantType]
                : true;
        }
        return true;
    }
    isPKCERequest(request, grantType) {
        if (grantType === 'authorization_code' && request.body.code_verifier) {
            return true;
        }
        return false;
    }
}
exports.TokenHandler = TokenHandler;
//# sourceMappingURL=token-handler.js.map