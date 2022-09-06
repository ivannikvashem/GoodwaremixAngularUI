import { AttributeConfig } from './attributeConfig.model';
import {Deserializable} from './deserializable.model';
import {BaseConfig} from "./baseSupplierConfig.model";
import {Package} from "./package.model";

export class SupplierConfig implements Deserializable{
  type: string | undefined;
  stripXMLNamespace: string | undefined;
  fileEncoding: string | undefined;
  prefix: string ='';
  zippedFileName: string | undefined;
  baseConfig: BaseConfig = new BaseConfig();
  //categoryConfig: any;
  documentConfig: any;
  imageConfig: any;
  attributeConfig: AttributeConfig = new AttributeConfig();
  packageConfig: Package = new Package();
  dateFormats: string[] = [];
  multipliers: any;

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
