import {Deserializable} from './deserializable.model';

export class ProductAttributeKey implements Deserializable{
  attributeIdBD: string | undefined;
  keySupplier: string | undefined;
  attributeBDName: string | undefined;
  multiplier: string | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
