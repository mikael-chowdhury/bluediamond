import { Field } from "./Field";
import { FieldArray } from "./FieldArray";

export class Title extends FieldArray {
  constructor(name: string) {
    super(
      new Field(""),
      new Field("-".repeat(name.length + 5)),
      new Field(name),
      new Field("-".repeat(name.length + 5)),
      new Field("")
    );
  }
}
