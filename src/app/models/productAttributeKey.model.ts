import {Deserializable} from './deserializable.model';

export class ProductAttributeKey implements Deserializable{
  attributeIdBD: string | undefined;
  keySupplier: string = '';
  attributeBDName: string | undefined;
  attributeValid: boolean | undefined;
  multiplier: string | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
