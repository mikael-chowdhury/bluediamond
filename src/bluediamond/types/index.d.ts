import { XmlElement } from "xmldoc";

export interface IDataGramMatrix {
  addField: (
    field:
      | import("../lib/Field").Field
      | import("../lib/DissapatedField").DissapatedField
  ) => void;
}

export interface IFieldArray {
  appendToDataGramMatrix: (table: IDataGramMatrix) => void;
}

declare global {
  interface Array<T> {
    slowmap(map: (obj: T, index: number, arr: Array<T>) => any): Promise<any[]>;
  }

  interface XmlDocument<T> {
    slowmap(
      map: (obj: T, index: number, arr: XmlElement) => any
    ): Promise<any[]>;
  }
}
