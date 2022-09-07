import {Deserializable} from './deserializable.model';

export class ImageConfig implements Deserializable{
  imageUrl: string | undefined;
  imageStartTag: string = '';
  images: string | undefined;
  supplierImageBaseUrl: string | undefined;
  downloadLocally: boolean | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
