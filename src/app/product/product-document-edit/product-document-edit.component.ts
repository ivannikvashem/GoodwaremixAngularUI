import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Document} from "../../models/document.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../service/notification-service";
export interface AttrDialogData {
  supplierId?:string;
  newDocument?: Document;
  oldDocument?:Document;
}
@Component({
  selector: 'app-product-document-edit',
  templateUrl: './product-document-edit.component.html',
  styleUrls: ['./product-document-edit.component.css']
})
export class ProductDocumentEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  documentProduct: Document = new Document();
  searchQueryCtrl  = new FormControl<string>('');
  form:FormGroup
  documentsToUpload:File[] = []
  preloadDocumentView:any
  isLoading:boolean = false
  documentsList:Document[] = []

  mimeExt:any[] = [
    {type:'pdf', mime:'application/pdf'}
  ]

  documentTypesList = [
    {code: 'SRT', descr: 'Сертификат соответствия'},
    {code: 'DLR', descr: 'Декларация о соответствии'},
    {code: 'RFL', descr: 'Отказное письмо'},
    {code: 'IFL', descr: 'Информационное письмо'},
    {code: 'MNL', descr: 'Инструкция по эксплуатации'},
    {code: 'ADV', descr: 'Рекламная брошюра'}
  ]

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<ProductDocumentEditComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData,
              private _notyf: NotificationService) {
    this.form = new FormGroup<any>({
      "certTitle": new FormControl<string>('', Validators.required),
      "certNumber": new FormControl<string>('', Validators.required),
      "type": new FormControl<string>('', Validators.required),
      "startDate": new FormControl<Date | null>(new Date(''), Validators.required),
      "endDate": new FormControl<Date | null>(new Date(''), Validators.required),
      "url": new FormControl<string>(''),
    })
  }

  ngOnInit(): void {
    if (this.data.oldDocument !== undefined) {
      this.documentProduct = this.data.oldDocument
      this.form.get("certTitle").setValue(this.documentProduct.certTitle)
      this.form.get("certNumber").setValue(this.documentProduct.certNumber)
      this.form.get("startDate").setValue(this.documentProduct.startDate)
      this.form.get("endDate").setValue(this.documentProduct.endDate)
      this.form.get("type").setValue(this.documentProduct.type)
      this.form.get("url").setValue(this.documentProduct.url)
      if (this.documentProduct.file != null) {
        this.preloadDocumentView = { oldName:this.documentProduct.file}
      }
    } else {
      this.api.getDocuments('', 0,100, '', 'desc').subscribe(x => {
        this.documentsList = x.body.data
      })
    }
  }

  onDocumentChange(event: any) {
    let reader = new FileReader()
    let file = event.target.files[0];
    if (this.mimeExt.some(x => x.mime == file.type) && file.type != '') {
      const oldFileName = file.name
      file = new File([file], crypto.randomUUID()+ '.' + this.mimeExt.find(x => x.mime == file.type).type, {type:file.type});
      reader.onload = () => {
        this.preloadDocumentView = {fileContent:file, newName:file.name, oldName:oldFileName, size:file.size}
      }
      reader.readAsDataURL(file);
    } else {
      this._notyf.onError(`Неверный формат документа`)
    }
  }

  deletePreloadDoc() {
    this.preloadDocumentView = null
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newDocument.certTitle = this.form.get("certTitle").value
      this.data.newDocument.certNumber = this.form.get("certNumber").value
      this.data.newDocument.startDate = this.form.get("startDate").value
      this.data.newDocument.endDate = this.form.get("endDate").value
      this.data.newDocument.type = this.form.get("type").value
      this.data.newDocument.url =  this.form.get("url").value
      this.data.newDocument.supplierId = this.data.supplierId
      this.data.newDocument.file = this.preloadDocumentView.newName
      this.uploadDocumentFiles()

      if (this.data.oldDocument != undefined) {
        this.updateDocument(this.data.newDocument)
      } else {
        this.insertDocument(this.data.newDocument)
      }
    }
  }

  insertDocument(newDocument:Document) {
    this.api.addDocument(newDocument).subscribe((x:any) => {
      this.data.newDocument.id = x.body
      })
  }

  updateDocument(document:Document) {
    this.data.newDocument.id = this.data.oldDocument.id
    this.api.updateDocument(document).subscribe(() => {
      if (this.documentsToUpload) {
        this.uploadDocumentFiles()
      }
    })
  }

  uploadDocumentFiles() {
    this.api.uploadDocument(this.preloadDocumentView.fileContent, this.data.supplierId).subscribe()
  }

  onCancelClick() {
    this.dialogRef.close()
  }

  searchQueryChanged(searchQuery:string) {
    this.api.getDocuments(searchQuery, 0, 100,'','desc').subscribe(x => {
      this.documentsList = x.body.data
    });
  }

}
