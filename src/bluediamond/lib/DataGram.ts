import { Field } from "./Field";

import { IDataGramMatrix } from "../types/index";
import { DissapatedField } from "./DissapatedField";
import { RotateMatrix } from "./util/RotateMatrix";

export class DataGram implements IDataGramMatrix {
  constructor(public matrix: Field[] | DissapatedField[] = []) {}

  public addField(field: Field | DissapatedField) {
    this.matrix.push(field);
  }

  private _getRotatedMatrix(): string[][] {
    return RotateMatrix(
      this.matrix.filter((line) => line instanceof DissapatedField)
    );
  }

  private async _getMaxSpaces(): Promise<number[]> {
    let temp = this._getRotatedMatrix();

    function getMax(arr: number[]) {
      return arr.reduce((max, v) => (max >= v ? max : v), -Infinity);
    }

    const max_spaces = await temp.slowmap(async (line, index) => {
      return getMax(
        line != undefined
          ? await line.slowmap((word) => (word != undefined ? word.length : 0))
          : [0]
      );
    });

    return max_spaces;
  }

  private async _spread(_space: number) {
    const max_spaces = await this._getMaxSpaces();

    let final = (
      await Promise.all(
        this.matrix.map((line, ln) => {
          return new Promise((res, rej) => {
            process.nextTick(() => {
              res(
                line instanceof DissapatedField
                  ? line
                      .map((word, index, arr) => {
                        return (
                          (arr[index - 1]
                            ? " ".repeat(
                                max_spaces[index - 1] -
                                  arr[index - 1].length +
                                  _space
                              )
                            : "") + word
                        );
                      })
                      .join("")
                  : (line as string[]).join(" ")
              );
            });
          });
        })
      )
    ).join("\n");

    return final;
  }

  async build(): Promise<string> {
    const spread = await this._spread(5);

    return spread;
  }
}
