import {Deserializable} from './deserializable.model';

export class Product implements Deserializable{
  Id: string | undefined;
  SupplierId: string | undefined;
  internalCode: string | undefined;
  Title: string | undefined;
  TitleLong: string | undefined;
  Description: string | undefined;
  Vendor: string | undefined; //objectId
  VendorId: string | undefined; //objectId
  Image360: string | undefined; //objectId
  Images: string[] | undefined; //objectId
  Attributes: string[] | undefined; //objectId
  sss: number | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
