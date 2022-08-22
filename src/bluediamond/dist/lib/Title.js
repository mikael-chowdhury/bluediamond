"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const Field_1 = require("./Field");
const FieldArray_1 = require("./FieldArray");
class Title extends FieldArray_1.FieldArray {
    constructor(name) {
        super(new Field_1.Field(""), new Field_1.Field("-".repeat(name.length + 5)), new Field_1.Field(name), new Field_1.Field("-".repeat(name.length + 5)), new Field_1.Field(""));
    }
}
exports.Title = Title;
