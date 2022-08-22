import { IFieldArray, IDataGramMatrix } from "../types";
import { DissapatedField } from "./DissapatedField";
import { Field } from "./Field";

export class DissapatedFieldArray
  extends Array<DissapatedField>
  implements IFieldArray
{
  constructor(...items: Field[]) {
    super(...items);
  }
  appendToDataGramMatrix(matrix: IDataGramMatrix) {
    this.forEach((field) => {
      matrix.addField(field);
    });
  }
}
