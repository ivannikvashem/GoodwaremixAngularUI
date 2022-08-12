import {Deserializable} from './deserializable.model';

export class baseSupplierConfig implements Deserializable{
  startTag: string | undefined;
  vendorId: string | undefined;
  title: string | undefined;
  titleLong: string | undefined;
  description: string | undefined;
  brand: string | undefined;
  image360: string | undefined;
  videos: string | undefined;
  country: string | undefined;
  countryCode: string | undefined;
  gtd: string[] | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
