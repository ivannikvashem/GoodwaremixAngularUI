import {Attribute} from "./attribute.model";
import {AttributeProduct} from "./attributeProduct.model";

export class Product {
  Id: string;
  supplierId: string;
  internalCode: string;
  title: string;
  titleLong: string;
  description: string;
  vendor: string;
  vendorId: string;
  images: string[];
  documents: Document[];
  image360: string;
  videos: string[];
  attributes: AttributeProduct[];
  createdAt: Date;
  updatedAt: Date;

}
