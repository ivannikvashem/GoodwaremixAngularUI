import { AttributeConfig } from './attributeConfig.model';
import {Deserializable} from './deserializable.model';
import {BaseSupplierConfig} from "./baseSupplierConfig.model";

export class SupplierConfig implements Deserializable{
  type: string | undefined;
  stripXMLNamespace: string | undefined;
  fileEncoding: string | undefined;
  prefix: string ='';
  zippedFileName: string | undefined;
  baseConfig: BaseSupplierConfig = new BaseSupplierConfig();
  //categoryConfig: any;
  documentConfig: any;
  imageConfig: any;
  attributeConfig: AttributeConfig = new AttributeConfig();
  packageConfig: any;
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
