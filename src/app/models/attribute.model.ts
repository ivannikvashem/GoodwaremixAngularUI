import {Deserializable} from './deserializable.model';

export class Attribute implements Deserializable{
  id: string | undefined;
  supplierId: string | undefined;
  supplierName: string | undefined;
  unit: string | undefined;
  type: string | undefined;
  fixed: boolean | undefined;
  nameAttribute: string | undefined;
  etimFeature: string | undefined;
  etimUnit: string | undefined;
  rating: number = 0;
  allValue: string[] | undefined;
  possibleAttributeName: string[] | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
