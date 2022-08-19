import { AttributeConfig } from './attributeConfig.model';
import {Deserializable} from './deserializable.model';

export class SupplierConfig implements Deserializable{
  type: string | undefined;
  stripXMLNamespace: string | undefined;
  fileEncoding: string | undefined;
  prefix: string | undefined;
  zippedFileName: string | undefined;
  baseConfig: any;
  //categoryConfig: any;
  documentConfig: any;
  imageConfig: any;
  attributeConfig: AttributeConfig | undefined;
  packageConfig: any;
  dateFormats: string[] | undefined;
  multipliers: any | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
