import { AttributeConfig } from './attributeConfig.model';
import {Deserializable} from './deserializable.model';
import {BaseConfig} from "./baseSupplierConfig.model";
import {DocumentConfig} from "./documentConfig.model";
import {ImageConfig} from "./imageConfig.model";
import {PackageConfig} from "./packageConfig.model";
import {NettoConfig} from "./nettoConfig.model";
import {Multipliers} from "./multipliers.model";

export class SupplierConfig implements Deserializable{
  type: string | undefined;
  stripXMLNamespace: string | undefined;
  fileEncoding: string | undefined;
  prefix: string ='';
  zippedFileName: string | undefined;
  baseConfig: BaseConfig = new BaseConfig();
  //categoryConfig: any;
  documentConfig: DocumentConfig = new DocumentConfig();
  imageConfig: ImageConfig = new ImageConfig();
  attributeConfig: AttributeConfig = new AttributeConfig();
  packageConfig: PackageConfig = new PackageConfig();
  nettoConfig: NettoConfig = new NettoConfig();
  dateFormats: string[] = [];
  multipliers: Multipliers = new Multipliers();

  constructor() {
    this.type = undefined;
    this.stripXMLNamespace = undefined;
    this.fileEncoding = undefined;
    this.prefix = '';
  }

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
