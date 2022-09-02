import {Deserializable} from './deserializable.model';

export class SourceSettings implements Deserializable{
  fileName: string = '';
  source: string | undefined;
  urlList: string = '';
  urlItem: string = '';
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
