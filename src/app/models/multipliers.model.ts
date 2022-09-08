import {Deserializable} from './deserializable.model';

export class Multipliers implements Deserializable{
  dimensionIndex: number = 1;
  volumeIndex: number = 1;
  weightIndex: number = 1;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
