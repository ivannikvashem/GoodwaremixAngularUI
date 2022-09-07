import {Deserializable} from './deserializable.model';

export class NettoConfig implements Deserializable{
  barcode: string | undefined;
  type: string | undefined;
  height: string | undefined;
  width: string | undefined;
  depth: string | undefined;
  volume: string | undefined;
  weight: string | undefined;
  packQty: string | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
