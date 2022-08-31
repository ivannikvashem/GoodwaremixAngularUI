import {Deserializable} from './deserializable.model';
import {ProductAttributeKey} from "./productAttributeKey.model";

export class AttributeConfig implements Deserializable{
  attributesStartTag: string | undefined;
  attributesURL: string | undefined;
  attributeName: string | undefined;
  etimFeature: string | undefined;
  etimValue: string | undefined;
  etimUnit: any;
  unit: any;
  type: any;
  value: any;
  productAttributeKeys: ProductAttributeKey[] | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
