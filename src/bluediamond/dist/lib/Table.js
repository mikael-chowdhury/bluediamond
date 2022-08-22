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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const DissapatedField_1 = require("./DissapatedField");
const DissipatedFieldArray_1 = require("./DissipatedFieldArray");
const Field_1 = require("./Field");
const process_1 = __importDefault(require("process"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const sas7bdat_1 = __importDefault(require("sas7bdat"));
class Table extends DissipatedFieldArray_1.DissapatedFieldArray {
    constructor(tableSize = 10000) {
        super();
        this.tableSize = tableSize;
        this.coloumns = [];
        this.rows = [];
        this.preLoadFilters = new Map();
    }
    addRow(row) {
        this.rows.push(row);
        return this;
    }
    addColoumn(name) {
        this.coloumns.push(name);
        return this;
    }
    applyPreLoadFilter(filter) {
        const index = this.coloumns.indexOf(filter.type);
        this.preLoadFilters.set(index, [
            ...(this.preLoadFilters.get(index) || []),
            filter,
        ]);
    }
    applyFilter(filter) {
        let i = this.coloumns.indexOf(filter.type);
        this.rows = this.rows.filter((row) => filter.predicate(row[i]));
        return this;
    }
    fromSAS(path, exclude = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield sas7bdat_1.default.parse(path);
            const headers = data[0];
            const indexedExclude = exclude
                .map((x) => headers.indexOf(x))
                .filter((x) => x > -1);
            this.coloumns = [...headers.filter((x, i) => !indexedExclude.includes(i))];
            data.splice(0, 1);
            let rownum = 0;
            const loop = () => {
                return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                    const row = data[rownum];
                    const promise = new Promise((resolve) => {
                        setImmediate(() => {
                            if (row) {
                                this.addRow(new DissapatedField_1.DissapatedField(...row
                                    .filter((item, itemnum) => {
                                    const filters = this.preLoadFilters.get(itemnum) || [];
                                    if (filters.every((filter) => filter.predicate(item)))
                                        return !indexedExclude.includes(itemnum);
                                })
                                    .map((item) => (item != null ? item.toString() : "null"))));
                                resolve(null);
                            }
                        });
                    });
                    yield promise;
                    if (rownum + 1 == data.length)
                        res(null);
                    rownum++;
                    res(loop());
                }));
            };
            yield loop();
            return this;
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.push(new DissapatedField_1.DissapatedField(...this.coloumns));
            this.push(new Field_1.Field("-".repeat(150)));
            yield Promise.all(this.rows.map((row) => new Promise((resolve, reject) => {
                process_1.default.nextTick(() => {
                    this.push(row);
                    resolve(null);
                });
            })));
            return this;
        });
    }
}
exports.Table = Table;
