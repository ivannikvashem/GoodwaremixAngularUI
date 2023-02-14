import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Document} from "../../models/document.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
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
  urlList:string[] = []
  form:FormGroup
  documentsToUpload:File[] = []
  preloadDocumentsView:any[] = []
  isLoading:boolean = false

  mimeExt:any[] = [
    {type:'pdf', mime:'application/pdf'},
    {type:'jpeg', mime:'image/jpeg'}
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
      "startDate": new FormControl<Date | null>(new Date('')),
      "endDate": new FormControl<Date | null>(new Date('')),
      "url": new FormControl<string[]>([]),
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
      for (let i = 0; i < this.documentProduct.files.length; i++) {
        this.preloadDocumentsView.push({id:i,oldName:this.documentProduct.files[i]})
      }
      this.urlList = this.documentProduct.url
    }
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

  onDocumentChange(event: any) {
    let i = -1;
    let errorCounter = 0;
    if (this.preloadDocumentsView.length > 0)
      i = this.preloadDocumentsView.length
    let files:any[] = Array.from(event.target.files);
    for (let file of files) {
      let reader = new FileReader();
      if (this.mimeExt.some(x => x.mime == file.type) && file.type != '') {
        const oldFileName = file.name
        file = new File([file], crypto.randomUUID()+ '.' + this.mimeExt.find(x => x.mime == file.type).type, {type:file.type});
        reader.onload = (fl:any) => {
          this.preloadDocumentsView.push({id:i+=1, fileContent:file, newName:file.name, oldName:oldFileName, size:file.size})
        }
        reader.readAsDataURL(file);
      } else { errorCounter += 1;}
    }
    if (errorCounter > 0) {
      this._notyf.onError(`Неверный формат документа (${errorCounter})`)
    }
  }

  deletePreloadDoc(id:number) {
    this.preloadDocumentsView = this.preloadDocumentsView.filter(x => x.id != id);
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newDocument.certTitle = this.form.get("certTitle").value
      this.data.newDocument.certNumber = this.form.get("certNumber").value
      this.data.newDocument.startDate = this.form.get("startDate").value
      this.data.newDocument.endDate = this.form.get("endDate").value
      this.data.newDocument.type = this.form.get("type").value
      this.data.newDocument.url =  this.urlList   //this.form.get("url").value
      this.data.newDocument.supplierId = this.data.supplierId

      this.preloadDocumentsView.forEach((value) => {
        if (value.oldName && value != null) {
          console.log(value)
          this.documentsToUpload.push(value.fileContent);
        }
        if (value.newName != null) {
          this.data.newDocument.files.push(value.newName)
        }
      })

      if (this.data.oldDocument != undefined) {
        this.data.newDocument.id = this.data.oldDocument.id
        this.api.updateDocument(this.data.newDocument).subscribe(x => {

        })
      } else {
        this.api.addDocument(this.data.newDocument).subscribe(x => {
          console.log(x)
          this.data.newDocument.id = x.body
        })
      }
      console.log(this.data.newDocument.id)
      this.api.uploadDocument(this.documentsToUpload, this.data.supplierId).subscribe(x => {
        console.log(x)
      })
    }
  }

  onCancelClick() {
  }
}
