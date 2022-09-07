import {Deserializable} from './deserializable.model';

export class DocumentConfig implements Deserializable{
  documentsStartTag: string | undefined;
  documentsURL: string = '';
  type: string | undefined;
  url: string | undefined;
  certTitle: string | undefined;
  certNumber: string | undefined;
  file: string | undefined;
  certOrganizNumber: string | undefined;
  certOrganizDescr: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  blankNumber: string | undefined;
  isDeleted: boolean | undefined;
  keywords: string | undefined;
  downloadLocally: boolean | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
