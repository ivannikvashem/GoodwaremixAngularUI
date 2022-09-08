import {Deserializable} from './deserializable.model';

export class Dimensions implements Deserializable{
  tagName: string = "";
  format: string = "";
  multiplier: number = 1;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
