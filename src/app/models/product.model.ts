import {AttributeProduct} from "./attributeProduct.model";
import {Document} from "./document.model";
import {Package} from "./package.model";

export class Product {
  id: string;
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
  netto:Package;
  packages:Package[];
  images: string[];
  thumbnails: string[];
  localImages: string[];
  documents: string[];
  image360: string;
  videos: string[];
  attributes: AttributeProduct[];
  createdAt: any;
  updatedAt: any;

  constructor() {
    this.gtd = []
    this.netto = new Package()
    this.packages = [] as Package[]
    this.images = []
    this.thumbnails = []
    this.localImages = []
    this.documents = []
    this.videos = []
    this.attributes = [] as AttributeProduct[]
  }
}
