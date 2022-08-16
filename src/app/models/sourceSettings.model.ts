import {Deserializable} from './deserializable.model';

export class SourceSettings implements Deserializable{
  fileName: string | undefined;
  source: string | undefined;
  urlList: string | undefined;
  urlItem: string | undefined;
  methodType: string | undefined;
  header: any;
  body: any;
  countPage: any;
  startPage: any;
  multipart: any;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
