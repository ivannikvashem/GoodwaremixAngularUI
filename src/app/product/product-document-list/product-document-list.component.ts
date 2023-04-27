import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductDocumentEditComponent} from "../product-document-edit/product-document-edit.component";
import {Document} from "../../models/document.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-product-document-list',
  templateUrl: './product-document-list.component.html',
  styleUrls: ['./product-document-list.component.css']
})
export class ProductDocumentListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>()
  documentsView:Document[] = []
  isLoading:boolean = false;
  constructor(public dialog: MatDialog, private _notyf: NotificationService, private api:ApiClient) { }
  @Input() document:string[] = []
  @Input() supplierId:string
  @Input() isChangeable:boolean
  @Input() isSelectable:boolean
  @Output() documentList = new EventEmitter<string[]>();


  ngOnInit(): void {
    if (this.document) {
      this.api.getDocumentsById(this.document).subscribe((response) => {
        if (response.status == 200)
          if (response.body.length > 0) {
            for (let i of response.body) {
              this.documentsView.push(i)
            }
          }
        })
    }
  }

  openDocumentEditorDialog(oldDocument?:any): void {
    if (this.supplierId) {
      const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
        width: '900px',
        autoFocus: false,
        data: {documentIds:this.documentsView.map(x => x.id), supplierId:this.supplierId, oldDocument: oldDocument, newDocument: new Document() },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != '') {
          if (this.documentsView.filter(x => x !== result?.newDocument)) {
            if (oldDocument == undefined) {
              this.documentsView.push(result.newDocument as Document)
              this.documentList.next( this.documentsView.map(x => x.id))
            } else {
              if (oldDocument !== result.newDocument) {
                const target = this.documentsView.find((obj) => obj === oldDocument)
                Object.assign(target, result.newDocument)
              }
            }
          }
        }
      });

    } else {
      this._notyf.onWarning('Выберите поставщика')
    }
  }

  onDocumentSelected(doc: any) {
    if (doc.toDelete) {
      this.documentsView = this.documentsView.filter(dc => (dc.id != doc.document.id))
      this.documentList.next(this.documentsView.map(x => x.id))
    } else {
      this.documentsView.push(doc.document as Document)
    }
  }
}
