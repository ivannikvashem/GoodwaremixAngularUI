import {AttributeProduct} from "./attributeProduct.model";
import {Document} from "./document.model";

export class Product {
  Id: string;
  supplierId: string;
  supplierName:string;
  internalCode: string;
  title: string;
  titleLong: string;
  description: string;
  vendor: string;
  vendorId: string;
  country:string;
  countryCode:string;
  gtd:string[];
  netto:any;
  package:any[];
  images: string[];
  documents: Document[];
  image360: string;
  videos: string[];
  attributes: AttributeProduct[];
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.gtd = []
    this.images = []
    this.documents = [] as Document[]
    this.videos = []
    this.attributes = [] as AttributeProduct[]
  }
}
