import { DissapatedField } from "./DissapatedField";
import { DissapatedFieldArray } from "./DissapatedFieldArray";
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

  public space() {
    this.rows.push(new DissapatedField(""));
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

  public applyFilterSync(filter: Filter) {
    let i = this.coloumns.indexOf(filter.type);
    const rows = this.rows.filter((row) => filter.predicate(row[i]));

    return rows;
  }

  public async getEnumValues(coloumn: string) {
    const index = this.coloumns.indexOf(coloumn);

    const cols = await this.rows.slowmap((item, i, arr) => {
      if (item) return item[index];

      return undefined;
    });

    return Array.from(new Set(cols));
  }

  public async getColoumnEnumCount(coloumn: string) {
    const index = this.coloumns.indexOf(coloumn);

    interface LooseObject {
      [key: string]: any;
    }

    const data: LooseObject = {};

    await this.rows.slowmap((item) => {
      if (item) {
        const _enum = item[index];

        data[_enum] = (data[_enum] || 0) + 1;
      }
    });

    return data;
  }

  public async getValuesFromEnum(
    coloumn: string,
    _enums: string[],
    value: string
  ) {
    const index = this.coloumns.indexOf(coloumn);
    const valueindex = this.coloumns.indexOf(value);

    interface LooseObject {
      [key: string]: any;
    }

    const data: LooseObject = {};

    await this.rows.slowmap((item) => {
      if (item) {
        if (_enums.includes(item[index])) {
          const _enum = _enums[_enums.indexOf(item[index])];

          data[_enum] = (data[_enum] || 0) + (parseInt(item[valueindex]) || 0);
        }
      }
    });

    return data;
  }

  public async fromSAS(
    path: string,
    exclude: string[] = [],
    include: string[] = []
  ): Promise<Table> {
    const data: any[][] = await SAS7BDAT.parse(path);
    const headers = data[0];

    const indexedExclude = exclude
      .map((x) => headers.indexOf(x))
      .filter((x) => x > -1);

    const indexedInclude = include
      .map((x) => headers.indexOf(x))
      .filter((x) => x >= -1);

    this.coloumns = [
      ...headers.filter(
        (x, i) => !indexedExclude.includes(i) && indexedInclude.includes(i)
      ),
    ];

    data.splice(0, 1);

    let rownum = 0;

    const loop = () => {
      return new Promise(async (res) => {
        const row = data[rownum];
        const promise = new Promise((resolve) => {
          setImmediate(() => {
            if (row) {
              if (this.rows.length < this.tableSize) {
                this.addRow(
                  new DissapatedField(
                    ...row
                      .filter((item, itemnum) => {
                        const filters: Filter[] =
                          this.preLoadFilters.get(itemnum) || [];

                        if (filters.every((filter) => filter.predicate(item)))
                          return (
                            !indexedExclude.includes(itemnum) &&
                            indexedInclude.includes(itemnum)
                          );
                      })
                      .map((item) => (item != null ? item.toString() : "null"))
                  )
                );
              }

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
    if (this.coloumns.length > 0) {
      this.push(new DissapatedField(...this.coloumns));
    }

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
