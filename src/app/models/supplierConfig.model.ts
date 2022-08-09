import {Deserializable} from './deserializable.model';

export class SupplierConfig implements Deserializable{
  input: string | undefined;
//  supplierId: string | undefined;
  title: string | undefined;
  titleLong: string | undefined;
  description: string | undefined;
  vendor: string | undefined;
  vendorId: string | undefined;
//  categoriesProduct: string | undefined;
//  categoriesStart: string | undefined;
//  categories: any | undefined;
  documentsStart: string | undefined;
  documentsURL: string | undefined;
  documents: any | undefined;
  images: string | undefined;
  imageConfig: any | undefined;
  image360: string | undefined;
  videos: string | undefined;
  attributesStart: string | undefined;
  attributesURL: string | undefined;
  attributesParam: any | undefined;
  productAttributeKeys: any[] | undefined;
  netto: any | undefined;
  packagesStart: string | undefined;
  packagesURL: string | undefined;
  packages: any[] | undefined;
//  features: any | undefined;
//  scripts: any | undefined;
  dateFormats: string[] | undefined;
  multipliers: any | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
