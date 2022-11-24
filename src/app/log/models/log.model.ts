import {Deserializable} from "../../models/deserializable.model";

export class Log implements Deserializable{
  id: string ;
  supplierId: string;
  supplierName: string;
  date: Date ;
  data: string[];
  status: string;
  result: string;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
