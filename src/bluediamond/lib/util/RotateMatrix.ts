import { resolve } from "path";

export const RotateMatrix = (matrix: any[][]): Promise<any[][]> => {
  return new Promise(async (_resolve, _reject) => {
    let _new: any[][] = [];

    await matrix.slowmap((row, rownum) => {
      return new Promise(async (resolve, reject) => {
        let cellnum = 0;
        if (row) {
          row.map(async (cell, cnum) => {
            if (cell != "") {
              if (_new.length > cellnum + 1) {
                _new[cellnum].push(cell);
              } else {
                _new.push([cell]);
              }

              cellnum++;
            }
          });
        }

        resolve(null);
      });
    });

    _resolve(_new);
  });
};
