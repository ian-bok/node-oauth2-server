"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64URLEncode = (buf) => {
    return buf.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};
//# sourceMappingURL=string-util.js.map