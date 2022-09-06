import {Deserializable} from './deserializable.model';

export class AttributeProduct implements Deserializable{
  attributeId: string | undefined;
  attributeName: string | undefined;
  etimFeature: string | undefined;
  etimValue: any;
  etimUnit: string | undefined;
  unit: string | undefined;
  type: string | undefined;
  value: any;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
