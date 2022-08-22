export class Filter {
  constructor(public type: string, public predicate: (value: any) => boolean) {}
}
