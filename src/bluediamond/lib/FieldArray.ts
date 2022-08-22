import { IFieldArray, IDataGramMatrix } from "../types";
import { Field } from "./Field";

export class FieldArray extends Array<Field> implements IFieldArray {
  constructor(...items: Field[]) {
    super(...items);
  }
  appendToDataGramMatrix(table: IDataGramMatrix) {
    this.forEach((field) => {
      table.addField(field);
    });
  }
}
