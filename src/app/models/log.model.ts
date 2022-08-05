import {Deserializable} from './deserializable.model';

export class Log implements Deserializable{
  id: string | undefined;
  supplierId: string | undefined;
  date: Date | undefined;
  data: string[] | undefined;
  status: string | undefined;
  result: string | undefined;
  totalAdded: number | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
