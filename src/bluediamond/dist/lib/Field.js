"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
class Field extends Array {
    constructor(...args) {
        super();
        args.forEach((arg) => {
            this.push(arg);
        });
    }
}
exports.Field = Field;
