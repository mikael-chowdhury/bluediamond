"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldArray = void 0;
class FieldArray extends Array {
    constructor(...items) {
        super(...items);
    }
    appendToDataGramMatrix(table) {
        this.forEach((field) => {
            table.addField(field);
        });
    }
}
exports.FieldArray = FieldArray;
