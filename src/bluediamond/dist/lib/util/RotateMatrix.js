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
exports.RotateMatrix = void 0;
const RotateMatrix = (matrix) => {
    return new Promise((_resolve, _reject) => __awaiter(void 0, void 0, void 0, function* () {
        let _new = [];
        yield matrix.slowmap((row, rownum) => {
            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                let cellnum = 0;
                if (row) {
                    row.map((cell, cnum) => __awaiter(void 0, void 0, void 0, function* () {
                        if (cell != "") {
                            if (_new.length > cellnum + 1) {
                                _new[cellnum].push(cell);
                            }
                            else {
                                _new.push([cell]);
                            }
                            cellnum++;
                        }
                    }));
                }
                resolve(null);
            }));
        });
        _resolve(_new);
    }));
};
exports.RotateMatrix = RotateMatrix;
