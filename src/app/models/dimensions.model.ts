import {Deserializable} from './deserializable.model';

export class Dimensions implements Deserializable{
  tagName: string | undefined;
  format: string | undefined;
  multiplier: number | undefined;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
