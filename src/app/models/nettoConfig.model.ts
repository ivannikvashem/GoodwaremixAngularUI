import {Deserializable} from './deserializable.model';
import {Dimensions} from "./dimensions.model";

export class NettoConfig implements Deserializable{
  barcode: string | undefined;
  type: string | undefined;
  height: string | undefined;
  width: string | undefined;
  depth: string | undefined;
  volume: string | undefined;
  weight: string | undefined;
  packQty: string | undefined;
  dimensions: Dimensions = new Dimensions();

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
