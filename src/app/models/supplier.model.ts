import {Deserializable} from './deserializable.model';
import {Stat} from "./Stat.model";
import {SupplierConfig} from "./supplierConfig.model";

export class Supplier implements Deserializable{
  id: string | undefined;
  supplierName: string | undefined;
  comment: number | undefined;
  stat: Stat | undefined;
  sourceSettings: any | undefined;
  supplierConfigs: SupplierConfig | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
