"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DissapatedFieldArray = void 0;
class DissapatedFieldArray extends Array {
    constructor(...items) {
        super(...items);
    }
    appendToDataGramMatrix(matrix) {
        this.forEach((field) => {
            matrix.addField(field);
        });
    }
}
exports.DissapatedFieldArray = DissapatedFieldArray;
