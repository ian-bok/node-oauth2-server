"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fn_1 = require("./utils/fn");
class Response {
    constructor(options = {}) {
        this.body = options.body || {};
        this.headers = {};
        this.status = 200;
        for (const field of Object.keys(options.headers || {})) {
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
    redirect(url) {
        this.set('Location', url);
        this.status = 302;
    }
    set(field, value) {
        this.headers[field.toLowerCase()] = value;
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map