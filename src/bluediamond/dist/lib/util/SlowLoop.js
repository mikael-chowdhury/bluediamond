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
if (!Array.prototype.slowmap) {
    Array.prototype.slowmap = function (func) {
        return __awaiter(this, void 0, void 0, function* () {
            const modified = [...this];
            let index = 0;
            const loop = () => {
                return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                    const obj = modified[index];
                    const promise = new Promise((resolve) => {
                        setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                            modified[index] = yield func(obj, index, modified);
                            resolve(null);
                        }));
                    });
                    yield promise;
                    if (index + 1 == this.length)
                        res(null);
                    index++;
                    res(loop());
                }));
            };
            yield loop();
            return modified;
        });
    };
}
