export const RotateMatrix = (matrix: any[][]): any[][] => {
  const _new: any[][] = [];

  matrix.forEach((row) => {
    let cellnum = 0;
    row.forEach((cell) => {
      if (cell != "") {
        if (_new.length > cellnum + 1) {
          _new[cellnum].push(cell);
        } else {
          _new.push([cell]);
        }

        cellnum++;
      }
    });
  });

  return _new;
};
