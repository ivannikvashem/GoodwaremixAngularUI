import {Deserializable} from "./deserializable.model";

export class Log implements Deserializable{
  id: string ;
  supplierId: string ;
  date: Date ;
  data: string[];
  status: string;
  result: string;
  totalAdded: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
