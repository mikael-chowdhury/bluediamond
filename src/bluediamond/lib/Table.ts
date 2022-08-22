import { DissapatedField } from "./DissapatedField";
import { DissapatedFieldArray } from "./DissipatedFieldArray";
import { Field } from "./Field";
import process from "process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SAS7BDAT from "sas7bdat";
import { Filter } from "./Filter";

export class Table extends DissapatedFieldArray {
  public coloumns: string[] = [];
  public rows: DissapatedField[] = [];

  public preLoadFilters: Map<number, Filter[]> = new Map();

  constructor(public tableSize: number = 10000) {
    super();
  }

  public addRow(row: Field) {
    this.rows.push(row);
    return this;
  }

  public addColoumn(name: string) {
    this.coloumns.push(name);
    return this;
  }

  public applyPreLoadFilter(filter: Filter) {
    const index = this.coloumns.indexOf(filter.type);

    this.preLoadFilters.set(index, [
      ...(this.preLoadFilters.get(index) || []),
      filter,
    ]);
  }

  public applyFilter(filter: Filter) {
    let i = this.coloumns.indexOf(filter.type);
    this.rows = this.rows.filter((row) => filter.predicate(row[i]));

    return this;
  }

  public async fromSAS(path: string, exclude: string[] = []): Promise<Table> {
    const data: any[][] = await SAS7BDAT.parse(path);
    const headers = data[0];

    const indexedExclude = exclude
      .map((x) => headers.indexOf(x))
      .filter((x) => x > -1);

    this.coloumns = [...headers.filter((x, i) => !indexedExclude.includes(i))];

    data.splice(0, 1);

    let rownum = 0;

    const loop = () => {
      return new Promise(async (res) => {
        const row = data[rownum];
        const promise = new Promise((resolve) => {
          setImmediate(() => {
            if (row) {
              this.addRow(
                new DissapatedField(
                  ...row
                    .filter((item, itemnum) => {
                      const filters: Filter[] =
                        this.preLoadFilters.get(itemnum) || [];

                      if (filters.every((filter) => filter.predicate(item)))
                        return !indexedExclude.includes(itemnum);
                    })
                    .map((item) => (item != null ? item.toString() : "null"))
                )
              );
              resolve(null);
            }
          });
        });

        await promise;

        if (rownum + 1 == data.length) res(null);

        rownum++;

        res(loop());
      });
    };

    await loop();

    return this;
  }

  async build() {
    this.push(new DissapatedField(...this.coloumns));
    this.push(new Field("-".repeat(150)));

    await Promise.all(
      this.rows.map(
        (row) =>
          new Promise((resolve, reject) => {
            process.nextTick(() => {
              this.push(row);
              resolve(null);
            });
          })
      )
    );

    return this;
  }
}
