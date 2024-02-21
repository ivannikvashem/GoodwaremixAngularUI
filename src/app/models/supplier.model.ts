import {Stat} from "./Stat.model";
import {ProductAttributeKey} from "./productAttributeKey.model";
import { Dimensions } from './dimensions.model';
import {Multipliers} from "./multipliers.model";
import {ProductCategoryKey} from "./productCategoryKey.model";

export class Supplier {
  id: string;
  supplierName: string;
  comment: number;
  version:number;
  caption:string;
  inn:string[];
  sharedLogo:string;
  brands:string[]
  runParser:boolean = false
  stat: Stat;
  supplierConfigs: SupplierConfig[];

  lastImport:string;
  productQty:number;
  productQtyWithCode:number;

  constructor() {
    this.inn = []
    this.brands = []
    this.stat = new Stat()
    this.supplierConfigs = [];
  }
}

export class SourceSettings {
  fileName: string;
  source: string;
  urlList: string;
  urlItem: string;
  methodType: string;
  header: any;
  body: any;
  countPage: string;
  startPage: string;
  multipart?: boolean;

  constructor() {
    this.header = []
  }
}

export class SupplierConfig {
  id:number;
  name:string;
  type: string;
  stripXMLNamespace: string;
  fileEncoding: string;
  prefix: string;
  zippedFileName: string;
  baseConfig: BaseConfig;
  //categoryConfig: any;
  documentConfig: DocumentConfig;
  imageConfig: ImageConfig;
  attributeConfig: AttributeConfig;
  categoryConfig: CategoryConfig;
  packageConfig: PackageConfig;
  nettoConfig: NettoConfig;
  dateFormats: string[];
  multipliers: Multipliers;
  sourceSettings: SourceSettings

  constructor() {
    this.baseConfig = new BaseConfig()
    this.documentConfig = new DocumentConfig()
    this.imageConfig = new ImageConfig()
    this.attributeConfig = new AttributeConfig()
    this.categoryConfig = new CategoryConfig()
    this.packageConfig = new PackageConfig()
    this.nettoConfig = new NettoConfig()
    this.multipliers = new Multipliers()
    this.sourceSettings = new SourceSettings()
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
}

export class DocumentConfig {
  documentsStartTag: string;
  documentsURL: string;
  type: string;
  url: string;
  certTitle: string;
  certNumber: string;
  file: string;
  certOrganizNumber: string;
  certOrganizDescr: string;
  startDate: Date;
  endDate: Date;
  blankNumber: string;
  isDeleted: boolean;
  keywords: string;
  downloadLocally: boolean;
  convertImageToPDF: boolean;
}

export class ImageConfig {
  imageUrl: string;
  imageStartTag: string;
  images: string;
  supplierImageBaseUrl: string;
  downloadClientType:string;
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
  bindType:boolean = true;

  constructor() {
    this.productAttributeKeys = [];
  }
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

export class CategoryConfig {
  typeURL: string;
  categoryURL: string;
  categoriesStartTag: string;
  categoriesProduct: string;
  categoryId: string;
  title: string;
  description: string;
  subCategoriesId: string;
  productCategoryKeys: ProductCategoryKey[];
  constructor() {
    this.productCategoryKeys = [];
  }
}

