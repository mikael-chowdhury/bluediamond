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
exports.Project = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const strings_1 = __importDefault(require("@supercharge/strings"));
class Project {
    constructor() { }
    run(func) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Project loaded.");
            const start = Date.now();
            require("./util/SlowLoop");
            const table = yield func();
            yield fs_1.default.promises.writeFile("./output.txt", table);
            const doc = new pdfkit_1.default();
            doc.registerFont("SourceCodePro", path_1.default.join(__dirname, "fonts", "font.ttf"));
            doc.pipe(fs_1.default.createWriteStream("./output.pdf"));
            doc.font("SourceCodePro").fontSize(5).fillColor("black");
            (0, strings_1.default)(table)
                .lines()
                .forEach((line, linenum) => {
                if (line == "") {
                    doc.text("\n");
                }
                else
                    doc.text(line);
            });
            doc.end();
            const end = Date.now();
            const elapsed = end - start;
            const lines = table.split("\n").length;
            console.log(`Process took ${elapsed}ms to load ${lines} lines of data (~${Math.floor(lines / (elapsed / 1000))} lines per second)`);
        });
    }
}
exports.Project = Project;
