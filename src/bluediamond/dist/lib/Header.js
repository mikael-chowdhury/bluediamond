"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const DissapatedField_1 = require("./DissapatedField");
const Field_1 = require("./Field");
const FieldArray_1 = require("./FieldArray");
class Header extends FieldArray_1.FieldArray {
    constructor(...args) {
        super(new Field_1.Field(""), new DissapatedField_1.DissapatedField(...args), new Field_1.Field("\n"));
    }
}
exports.Header = Header;
