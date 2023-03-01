export class Stat {
  constructor(
    public productQty: number = 0,
    public productQtyWithCode: number = 0,
    public lastImport: Date = new Date()
  ) {}
}
