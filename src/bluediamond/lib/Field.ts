export class Field extends Array<string> {
  constructor(...args: string[]) {
    super();

    args.forEach((arg) => {
      this.push(arg);
    });
  }
}
