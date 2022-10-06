import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../../repo/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Document} from "../../../models/document.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface AttrDialogData {
  newDocument?: Document;
  oldDocument?:Document;
}

@Component({
  selector: 'app-product-document-edit',
  templateUrl: './product-document-edit.html',
  styleUrls: ['./product-document-edit.css']
})
export class ProductDocumentEdit implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  documentProduct: Document = new Document();
  urlList:string[] = []
  form:FormGroup
  documentTypesList = [
    {code: 'SRT', descr: 'Сертификат соответствия'},
    {code: 'DLR', descr: 'Декларация о соответствии'},
    {code: 'RFL', descr: 'Отказное письмо'},
    {code: 'IFL', descr: 'Информационное письмо'},
    {code: 'MNL', descr: 'Инструкция по эксплуатации'},
    {code: 'ADV', descr: 'Рекламная брошюра'}
  ]

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<ProductDocumentEdit>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData) {
    this.form = new FormGroup<any>({
      "certTitle": new FormControl<string>('', Validators.required),
      "certNumber": new FormControl<string>('', Validators.required),
      "type": new FormControl<string>('', Validators.required),
      "startDate": new FormControl<Date | null>(new Date('')),
      "endDate": new FormControl<Date | null>(new Date('')),
      "url": new FormControl<string[]>([]),
    })
  }

  ngOnInit(): void {
    if (this.data.oldDocument !== undefined) {
      this.form.get("certTitle").setValue(this.data.oldDocument.certTitle)
      this.form.get("certNumber").setValue(this.data.oldDocument.certNumber)
      this.form.get("startDate").setValue(this.data.oldDocument.startDate)
      this.form.get("endDate").setValue(this.data.oldDocument.endDate)
      this.form.get("type").setValue(this.data.oldDocument.type)
      //this.form.get("url").setValue(this.data.oldDocument.url)
      this.urlList = this.data.oldDocument.url
      this.documentProduct = this.data.oldDocument
    }
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newDocument.certTitle = this.form.get("certTitle").value
      this.data.newDocument.certNumber = this.form.get("certNumber").value
      this.data.newDocument.startDate = this.form.get("startDate").value
      this.data.newDocument.endDate = this.form.get("endDate").value
      this.data.newDocument.type = this.form.get("type").value
      this.data.newDocument.url =  this.urlList   //this.form.get("url").value
    }
  }

  onCancelClick() {
    console.log('closed')
  }

  addUrl($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    if (value) {
      this.form.get('url').value.push(value)
      this.urlList.push(value)
    }
    $event.chipInput!.clear()
  }

  removeUrl(url: any) {
    const index = this.urlList.indexOf(url);
    if (index >= 0) {
      this.urlList.splice(index, 1);
    }
  }
}
