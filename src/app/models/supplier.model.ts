import {Stat} from "./Stat.model";
import {ProductAttributeKey} from "./productAttributeKey.model";
import { Dimensions } from './dimensions.model';
import {Multipliers} from "./multipliers.model";



export class Supplier {
  id: string
  supplierName: string;
  comment: number;
  runParser:boolean = false
  stat: Stat;
  sourceSettings: SourceSettings
  supplierConfigs: SupplierConfig

  constructor() {
    this.sourceSettings = new SourceSettings()
    this.stat = new Stat()
    this.supplierConfigs = new SupplierConfig()
  }
}

export class SourceSettings {
  fileName: string
  source: string;
  urlList: string
  urlItem: string
  methodType: string
  header: any;
  body: any;
  countPage: string;
  startPage: string;
  multipart?: boolean;
}

export class SupplierConfig {
  type: string
  stripXMLNamespace: string
  fileEncoding: string;
  prefix: string;
  zippedFileName: string;
  baseConfig: BaseConfig;
  //categoryConfig: any;
  documentConfig: DocumentConfig;
  imageConfig: ImageConfig ;
  attributeConfig: AttributeConfig;
  packageConfig: PackageConfig;
  nettoConfig: NettoConfig;
  dateFormats: string[];
  multipliers: Multipliers;

  constructor() {
    this.baseConfig = new BaseConfig()
    this.documentConfig = new DocumentConfig()
    this.imageConfig = new ImageConfig()
    this.attributeConfig = new AttributeConfig()
    this.packageConfig = new PackageConfig()
    this.nettoConfig = new NettoConfig()
    this.multipliers = new Multipliers()
  }
}

export class BaseConfig {
  startTag: string;
  vendorId: string;
  title: string;
  titleLong: string;
  description: string;
  brand: string;
  image360: string;
  videos: string;
  country: string;
  countryCode: string;
  gtd: string;
  //
}

export class DocumentConfig {
  documentsStartTag: string
  documentsURL: string
  type: string
  url: string
  certTitle: string
  certNumber: string
  file: string
  certOrganizNumber: string
  certOrganizDescr: string
  startDate: Date
  endDate: Date
  blankNumber: string
  isDeleted: boolean
  keywords: string
  downloadLocally: boolean
  //
  certDescr:string
}

export class ImageConfig {
  imageUrl: string ;
  imageStartTag: string;
  images: string;
  supplierImageBaseUrl: string;
  downloadClientType:string
}

export class AttributeConfig {
  attributesStartTag: string
  attributesURL: string
  attributeName: string
  etimFeature: string
  etimValue: string
  etimUnit: any;
  unit: any;
  type: any;
  value: any;
  productAttributeKeys: ProductAttributeKey[];
  //
  attrType:string
}

export class PackageConfig {
  packagesStartTag: string;
  packagesURL: string;
  barcode?: string;
  type: string;
  height: string;
  width: string;
  depth: string;
  volume: string;
  weight: string;
  packQty?: string;
  dimensions: Dimensions;

  constructor() {
    this.dimensions = new Dimensions()
  }
}

export class NettoConfig {
  barcode: string;
  type: string;
  height: string;
  width: string;
  depth: string;
  volume: string;
  weight: string;
  packQty: string;
  dimensions: Dimensions

  constructor() {
    this.dimensions = new Dimensions()
  }
}

