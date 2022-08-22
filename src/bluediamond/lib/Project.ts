import fs from "fs";
import path from "path";

import PDFDocument, { fontSize } from "pdfkit";

import Str from "@supercharge/strings";

export class Project {
  constructor() {}

  async run(func: () => Promise<string>) {
    console.log("Project loaded.");

    const start = Date.now();

    require("./util/SlowLoop");
    const table = await func();

    await fs.promises.writeFile("./output.txt", table);

    const doc = new PDFDocument();

    doc.registerFont(
      "SourceCodePro",
      path.join(__dirname, "fonts", "font.ttf")
    );

    doc.pipe(fs.createWriteStream("./output.pdf"));
    doc.font("SourceCodePro").fontSize(5).fillColor("black");

    Str(table)
      .lines()
      .forEach((line, linenum) => {
        if (line == "") {
          doc.text("\n");
        } else doc.text(line);
      });

    doc.end();

    const end = Date.now();
    const elapsed = end - start;
    const lines = table.split("\n").length;

    console.log(
      `Process took ${elapsed}ms to load ${lines} lines of data (~${Math.floor(
        lines / (elapsed / 1000)
      )} lines per second)`
    );
  }
}
