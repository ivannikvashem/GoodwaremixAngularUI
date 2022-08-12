import {Deserializable} from './deserializable.model';

export class Stat implements Deserializable{
  productQty: number | undefined;
  productQtyWithCode: number | undefined;
  brands: string[] | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
