import {Deserializable} from './deserializable.model';
import {Stat} from "./Stat.model";
import {SupplierConfig} from "./supplierConfig.model";
import {SourceSettings} from "./sourceSettings.model";
import {NettoConfig} from "./nettoConfig.model";
import {Dimensions} from "./dimensions.model";

export class Supplier implements Deserializable{
  id: string | undefined;
  supplierName: string | undefined;
  comment: number | undefined;
  stat: Stat = new Stat();
  sourceSettings: SourceSettings = new SourceSettings();
  supplierConfigs: SupplierConfig = new SupplierConfig();

  constructor() {
    this.sourceSettings = new SourceSettings();
    this.supplierConfigs = new SupplierConfig();
    this.stat = new Stat();
  }

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
