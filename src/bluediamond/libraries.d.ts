import { parse } from "path";

declare module "sas7bdat" {
  function parse(path: string): any[][] {}
}
