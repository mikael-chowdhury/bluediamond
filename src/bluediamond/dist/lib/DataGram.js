"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGram = void 0;
const DissapatedField_1 = require("./DissapatedField");
const RotateMatrix_1 = require("./util/RotateMatrix");
class DataGram {
    constructor(matrix = []) {
        this.matrix = matrix;
    }
    addField(field) {
        this.matrix.push(field);
    }
    _getRotatedMatrix() {
        return (0, RotateMatrix_1.RotateMatrix)(this.matrix.filter((line) => line instanceof DissapatedField_1.DissapatedField));
    }
    _getMaxSpaces() {
        return __awaiter(this, void 0, void 0, function* () {
            let temp = this._getRotatedMatrix();
            function getMax(arr) {
                return arr.reduce((max, v) => (max >= v ? max : v), -Infinity);
            }
            const max_spaces = yield temp.slowmap((line, index) => __awaiter(this, void 0, void 0, function* () {
                return getMax(line != undefined
                    ? yield line.slowmap((word) => (word != undefined ? word.length : 0))
                    : [0]);
            }));
            return max_spaces;
        });
    }
    _spread(_space) {
        return __awaiter(this, void 0, void 0, function* () {
            const max_spaces = yield this._getMaxSpaces();
            let final = (yield Promise.all(this.matrix.map((line, ln) => {
                return new Promise((res, rej) => {
                    process.nextTick(() => {
                        res(line instanceof DissapatedField_1.DissapatedField
                            ? line
                                .map((word, index, arr) => {
                                return ((arr[index - 1]
                                    ? " ".repeat(max_spaces[index - 1] -
                                        arr[index - 1].length +
                                        _space)
                                    : "") + word);
                            })
                                .join("")
                            : line.join(" "));
                    });
                });
            }))).join("\n");
            return final;
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const spread = yield this._spread(5);
            return spread;
        });
    }
}
exports.DataGram = DataGram;
