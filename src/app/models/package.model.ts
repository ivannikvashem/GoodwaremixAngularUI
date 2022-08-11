import {Deserializable} from './deserializable.model';

export class Package implements Deserializable{
  barcode: string;
  type: string | undefined;
  height: number | undefined;
  width: number | undefined;
  depth: number | undefined;
  volume: number | undefined;
  weight: number | undefined;
  packQty: number | undefined;

  constructor(barcode: string = "") {
    this.barcode = barcode;
    this.packQty = 1;
  }

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
