import {Deserializable} from './deserializable.model';

export class Product implements Deserializable{
  Id: string | undefined;
  SupplierId: string | undefined;
  internalCode: string | undefined;
  Title: string | undefined;
  TitleLong: string | undefined;
  Description: string | undefined;
  Vendor: string | undefined;
  VendorId: string | undefined;
  Image360: string | undefined;
  Images: string[] | undefined;
  Attributes: string[] | undefined;
  sss: number | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
