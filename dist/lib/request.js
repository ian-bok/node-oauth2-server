"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeis = require("type-is");
const errors_1 = require("./errors");
const fn_1 = require("./utils/fn");
class Request {
    constructor(options = {}) {
        if (!options.headers) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `headers`');
        }
        if (!options.method) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `method`');
        }
        if (typeof options.method !== 'string') {
            throw new errors_1.InvalidArgumentError('Invalid parameter: `method`');
        }
        if (!options.query) {
            throw new errors_1.InvalidArgumentError('Missing parameter: `query`');
        }
        this.body = options.body || {};
        this.headers = {};
        this.method = options.method.toUpperCase();
        this.query = options.query;
        for (const field of Object.keys(options.headers)) {
            if (fn_1.hasOwnProperty(options.headers, field)) {
                this.headers[field.toLowerCase()] = options.headers[field];
            }
        }
        for (const property of Object.keys(options)) {
            if (fn_1.hasOwnProperty(options, property) && !this[property]) {
                this[property] = options[property];
            }
        }
    }
    get(field) {
        return this.headers[field.toLowerCase()];
    }
    is(...args) {
        let types = args;
        if (Array.isArray(types[0])) {
            types = types[0];
        }
        return typeis(this, types) || false;
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map