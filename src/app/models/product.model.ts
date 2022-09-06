import {Deserializable} from './deserializable.model';
import {Attribute} from "./attribute.model";
import {AttributeProduct} from "./attributeProduct.model";

export class Product implements Deserializable{
  Id: string | undefined;
  supplierId: string | undefined;
  internalCode: string | undefined;
  title: string | undefined;
  titleLong: string | undefined;
  description: string | undefined;
  vendor: string | undefined;
  vendorId: string | undefined;
  images: string[] | undefined;
  documents: Document[] | undefined;
  image360: string | undefined;
  videos: string[] | undefined;
  attributes: AttributeProduct[] | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
