"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotateMatrix = void 0;
const RotateMatrix = (matrix) => {
    const _new = [];
    matrix.forEach((row) => {
        let cellnum = 0;
        row.forEach((cell) => {
            if (cell != "") {
                if (_new.length > cellnum + 1) {
                    _new[cellnum].push(cell);
                }
                else {
                    _new.push([cell]);
                }
                cellnum++;
            }
        });
    });
    return _new;
};
exports.RotateMatrix = RotateMatrix;
