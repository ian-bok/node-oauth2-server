"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const errors_1 = require("../errors");
class ClientCredentialsGrantType extends _1.AbstractGrantType {
    constructor(options = {}) {
        super(options);
        if (!options.model) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `model`');
        }
        if (!options.model.getUserFromClient) {
            throw new errors_1.InvalidArgumentError('Invalid argument: model does not implement `getUserFromClient()`');
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
        const user = await this.getUserFromClient(client);
        return this.saveToken(user, client, scope);
    }
    async getUserFromClient(client) {
        const user = await this.model.getUserFromClient(client);
        if (!user) {
            throw new errors_1.InvalidGrantError('Invalid grant: user credentials are invalid');
        }
        return user;
    }
    async saveToken(user, client, scope) {
        const accessScope = await this.validateScope(user, client, scope);
        const accessToken = await this.generateAccessToken(client, user, scope);
        const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
        const token = {
            accessToken,
            accessTokenExpiresAt,
            scope: accessScope,
        };
        return this.model.saveToken(token, client, user);
    }
}
exports.ClientCredentialsGrantType = ClientCredentialsGrantType;
//# sourceMappingURL=client-credentials-grant-type.js.map