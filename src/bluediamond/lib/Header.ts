import { DissapatedField } from "./DissapatedField";
import { Field } from "./Field";
import { FieldArray } from "./FieldArray";

export class Header extends FieldArray {
  constructor(...args: string[]) {
    super(new Field(""), new DissapatedField(...args), new Field("\n"));
  }
}
