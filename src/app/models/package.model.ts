
export class Package {
  barcode: string;
  type: string;
  height: number;
  width: number;
  depth: number;
  weight: number;
  volume: number;
  packQty: number;

  constructor(barcode: string = "") {
    this.barcode = barcode;
    this.packQty = 1;
  }
}
