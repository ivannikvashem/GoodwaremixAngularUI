import {Component, Inject, OnInit} from '@angular/core';
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Document} from "../../models/document.model";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../service/notification-service";
import {MissingImageHandler} from "../MissingImageHandler";
import {Supplier} from "../../models/supplier.model";
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
export interface AttrDialogData {
  documentIds:string[]
  supplierId?:string;
  newDocument?: Document;
  oldDocument?:Document;
}
@Component({
  selector: 'app-product-document-edit',
  templateUrl: './product-document-edit.component.html',
  styleUrls: ['./product-document-edit.component.scss']
})
export class ProductDocumentEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  documentProduct: Document = new Document();
  searchQueryCtrl  = new FormControl<string>('');
  form:FormGroup
  preloadDocumentView:any
  isLoading:boolean = false
  documentsList:Document[] = []
  previewImg:string
  files: FileSystemHandle[] = []
  searchSuppliersCtrl  = new FormControl<string | Supplier>('');
  supplierList:Supplier[] = []


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
              private _notyf: NotificationService,
              private imgHandler:MissingImageHandler) {
    this.form = new FormGroup<any>({
      "certTitle": new FormControl<string>('', Validators.required),
      "certNumber": new FormControl<string>('', Validators.required),
      "type": new FormControl<string>('', Validators.required),
      "url": new FormControl<string>(''),
      "range": new FormGroup({
        "startDate": new FormControl<Date | null>(new Date(''), Validators.required),
        "endDate": new FormControl<Date | null>(new Date(''), Validators.required),
      })
    })
  }

  ngOnInit(): void {
    if (this.data.supplierId) {
      this.api.getSupplierById(this.data.supplierId).subscribe(x => {
        this.searchSuppliersCtrl.setValue(x.body)
      })
      this.searchSuppliersCtrl.disable()
    }

    if (this.data.oldDocument !== undefined) {
      this.documentProduct = this.data.oldDocument
      this.form.get("certTitle").setValue(this.documentProduct.certTitle)
      this.form.get("certNumber").setValue(this.documentProduct.certNumber)
      this.form.get("range.startDate").setValue(this.documentProduct.startDate)
      this.form.get("range.endDate").setValue(this.documentProduct.endDate)
      this.form.get("type").setValue(this.documentProduct.type)
      this.form.get("url").setValue(this.documentProduct.url)
      if (this.documentProduct.file != null) {
        this.preloadDocumentView = { fileName:this.documentProduct.file}
      }
    } else {
      this.api.getDocuments('', 0,600, this.data.supplierId, '', 'desc').subscribe(x => {
        this.documentsList = x.body.data
        for (let i of this.documentsList) {
          if (this.data.documentIds.find(x => x == i.id)) {
           this.documentsList = this.documentsList.filter(x => x !== i)
          }
        }
      })
    }

    this.searchSuppliersCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => {
        //this.isLoading = true;
      }),
      switchMap(value => this.api.getSuppliers(value, 0 ,100,"supplierName", "asc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((data: any) => { this.supplierList = data.body.data; });
  }

  onDocumentChange(event: any, isDropped:boolean) {
    let file:File;
    if (isDropped) {
      event.preventDefault()
      file = event.dataTransfer.files[0]
    } else {
      file = event.target.files[0];
    }
    let reader = new FileReader()
    if (this.mimeExt.some(x => x.mime == file.type) && file.type != '') {
      //const oldFileName = file.name
      //file = new File([file], this.generateUUID()+ '.' + this.mimeExt.find(x => x.mime == file.type).type, {type:file.type});

      reader.onload = () => {
        this.preloadDocumentView = {fileContent:file, fileName:file.name, size:file.size}
      }
      reader.readAsDataURL(file);
    } else {
      this._notyf.onError(`Неверный формат документа`)
    }
  }

  deletePreloadDoc() {
    this.preloadDocumentView = null
    this.documentProduct.preview = null
    this.data.newDocument.preview = null
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newDocument.certTitle = this.form.get("certTitle").value
      this.data.newDocument.certNumber = this.form.get("certNumber").value
      this.data.newDocument.startDate = this.form.get("range.startDate").value
      this.data.newDocument.endDate = this.form.get("range.endDate").value
      this.data.newDocument.type = this.form.get("type").value
      this.data.newDocument.url =  this.form.get("url").value
      this.data.newDocument.supplierId = this.data.supplierId

   /*   if (this.preloadDocumentView != undefined) {
        this.data.newDocument.file = this.preloadDocumentView.fileName
        this.data.newDocument.preview = this.preloadDocumentView.fileName.split('.')[0] + '.png'
      }
*/
      if (this.data.oldDocument?.id != undefined) {
        this.updateDocument(this.data.newDocument)
      } else {
        this.insertDocument(this.data.newDocument)
      }
    }
  }

  async insertDocument(newDocument:Document) {
    let promise = new Promise((resolve, reject) => {
      this.api.addDocument(newDocument).subscribe((x:any) => {
        if (x.body) {
          this.data.newDocument.id = x.body
          resolve(true)
        }
        if (this.preloadDocumentView?.fileContent != undefined) {
          this.uploadDocumentFiles()
        }
      })
    })
    let res = await promise
    if (res)
      this.dialogRef.close(this.data)
  }

  updateDocument(document:Document) {
    this.data.newDocument.id = this.data.oldDocument.id
    this.api.updateDocument(document).subscribe(() => {
      if (this.preloadDocumentView?.fileContent != undefined)
        this.uploadDocumentFiles()
    })
    this.dialogRef.close(this.data)
  }

  uploadDocumentFiles() {
    this.api.uploadDocument(this.preloadDocumentView.fileContent, this.data.newDocument.id).subscribe(x => {console.log(x)})
  }

  onCancelClick() {
    this.dialogRef.close()
  }

  searchQueryChanged(searchQuery:string) {
    this.api.getDocuments(searchQuery, 0, 100, this.data.supplierId,'','desc').subscribe(x => {
      this.documentsList = x.body.data
    });
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }

  onDragOver($event: DragEvent) {
    $event.stopPropagation()
    $event.preventDefault()
  }

  onDocumentSelected(document: any) {
    this.data.newDocument = document.document
    this.dialogRef.close(this.data)
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  onSupplierSelected() {
    this.data.supplierId = (this.searchSuppliersCtrl.value as Supplier).id
  }

  generateUUID(): string {
    let uuid = '', ii;
    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
        case 8:
        case 20:
          uuid += '-';
          uuid += Math.random() * 16 | 0;
          break;
        case 12:
          uuid += '-';
          uuid += '4';
          break;
        case 16:
          uuid += '-';
          uuid += (Math.random() * 4 | 8).toString(16);
          break;
        default:
          uuid += (Math.random() * 16 | 0).toString(16);
      }
    }
    return uuid;
  }

}
