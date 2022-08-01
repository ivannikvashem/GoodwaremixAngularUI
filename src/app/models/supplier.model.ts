import {Deserializable} from './deserializable.model';

export class Supplier implements Deserializable{
  id: string | undefined;
  connection: string | undefined;
  supplierName: string | undefined;
  productQty: number | undefined;
  productQtyWithCode: number | undefined;
  brands: string[] | undefined;
  source: string | undefined;
  type: string | undefined;
  sourceSettings: any | undefined;
  supplierConfigs: any | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
