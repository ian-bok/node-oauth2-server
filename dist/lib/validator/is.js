"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rules = {
    NCHAR: /^[\u002D|\u002E|\u005F|\w]+$/,
    NQCHAR: /^[\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
    NQSCHAR: /^[\u0020-\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
    UNICODECHARNOCRLF: /^[\u0009|\u0020-\u007E|\u0080-\uD7FF|\uE000-\uFFFD|\u10000-\u10FFFF]+$/,
    URI: /^[a-zA-Z][a-zA-Z0-9+.-]+:/,
    VSCHAR: /^[\u0020-\u007E]+$/,
};
exports.nchar = (value) => Rules.NCHAR.test(value);
exports.nqchar = (value) => Rules.NQCHAR.test(value);
exports.nqschar = (value) => Rules.NQSCHAR.test(value);
exports.uchar = (value) => Rules.UNICODECHARNOCRLF.test(value);
exports.uri = (value) => Rules.URI.test(value);
exports.vschar = (value) => Rules.VSCHAR.test(value);
//# sourceMappingURL=is.js.map