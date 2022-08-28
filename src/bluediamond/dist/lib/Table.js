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
const DissapatedFieldArray_1 = require("./DissapatedFieldArray");
const Field_1 = require("./Field");
const process_1 = __importDefault(require("process"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const sas7bdat_1 = __importDefault(require("sas7bdat"));
class Table extends DissapatedFieldArray_1.DissapatedFieldArray {
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
    space() {
        this.rows.push(new DissapatedField_1.DissapatedField(""));
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
    applyFilterSync(filter) {
        let i = this.coloumns.indexOf(filter.type);
        const rows = this.rows.filter((row) => filter.predicate(row[i]));
        return rows;
    }
    getEnumValues(coloumn) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.coloumns.indexOf(coloumn);
            const cols = yield this.rows.slowmap((item, i, arr) => {
                if (item)
                    return item[index];
                return undefined;
            });
            return Array.from(new Set(cols));
        });
    }
    getColoumnEnumCount(coloumn) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.coloumns.indexOf(coloumn);
            const data = {};
            yield this.rows.slowmap((item) => {
                if (item) {
                    const _enum = item[index];
                    data[_enum] = (data[_enum] || 0) + 1;
                }
            });
            return data;
        });
    }
    getValuesFromEnum(coloumn, _enums, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.coloumns.indexOf(coloumn);
            const valueindex = this.coloumns.indexOf(value);
            const data = {};
            yield this.rows.slowmap((item) => {
                if (item) {
                    if (_enums.includes(item[index])) {
                        const _enum = _enums[_enums.indexOf(item[index])];
                        data[_enum] = (data[_enum] || 0) + (parseInt(item[valueindex]) || 0);
                    }
                }
            });
            return data;
        });
    }
    fromSAS(path, exclude = [], include = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield sas7bdat_1.default.parse(path);
            const headers = data[0];
            const indexedExclude = exclude
                .map((x) => headers.indexOf(x))
                .filter((x) => x > -1);
            const indexedInclude = include
                .map((x) => headers.indexOf(x))
                .filter((x) => x >= -1);
            this.coloumns = [
                ...headers.filter((x, i) => !indexedExclude.includes(i) && indexedInclude.includes(i)),
            ];
            data.splice(0, 1);
            let rownum = 0;
            const loop = () => {
                return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                    const row = data[rownum];
                    const promise = new Promise((resolve) => {
                        setImmediate(() => {
                            if (row) {
                                if (this.rows.length < this.tableSize) {
                                    this.addRow(new DissapatedField_1.DissapatedField(...row
                                        .filter((item, itemnum) => {
                                        const filters = this.preLoadFilters.get(itemnum) || [];
                                        if (filters.every((filter) => filter.predicate(item)))
                                            return (!indexedExclude.includes(itemnum) &&
                                                indexedInclude.includes(itemnum));
                                    })
                                        .map((item) => (item != null ? item.toString() : "null"))));
                                }
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
            if (this.coloumns.length > 0) {
                this.push(new DissapatedField_1.DissapatedField(...this.coloumns));
            }
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
