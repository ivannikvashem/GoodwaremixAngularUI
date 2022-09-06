import {Deserializable} from './deserializable.model';

export class Document implements Deserializable{
  id: string | undefined;
  supplierId: string = '';
  type: string | undefined;
  url: string | undefined;
  certId: string | undefined;
  certNumber: string | undefined;
  certDescr: string | undefined;
  file: string | undefined;
  certOrganizNumber: string | undefined;
  certOrganizDescr: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  blankNumber: string | undefined;
  isDeleted: boolean | undefined;
  keywords: string[] | undefined;
  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
